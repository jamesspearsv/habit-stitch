import { pb } from '@/lib/pb'
import type { Activity, Habit, MappedActivity, MappedHabit, Result, SummaryMap } from '@/lib/types'
import { ClientResponseError } from 'pocketbase'

function mapHabits(habits: Habit[], activities: Activity[]) {
  const map: MappedHabit[] = []

  habits.forEach((habit) => {
    // Filter activities for those that match the current habit
    const activity = activities.filter((activity) => activity.habit_id === habit.id)[0]

    map.push({
      id: habit.id,
      habit_name: habit.habit_name,
      habit_color: habit.habit_color,
      completed_date: activity ? activity.date : '',
      activity_id: activity ? activity.id : '',
    })
  })
  return map
}

export async function createHabit(data: { habit_name: string }): Promise<Result> {
  if (!pb.authStore.record) return { success: false, error: 'No logged in user' }

  const habit = {
    habit_name: data.habit_name,
    user_id: [pb.authStore.record?.id],
  }

  try {
    await pb.collection('habits').create(habit)
    return { success: true, data: 'Successfully created habit' }
  } catch (error) {
    if (error instanceof ClientResponseError) {
      console.error(`${error.status}: ${error.message}`)
    }
    return { success: false, error: 'Unable to create habit' }
  }
}

export async function fetchHabits(): Promise<Result<MappedHabit[]>> {
  // Build start and end dates for today
  let todayStart: Date | string = new Date()
  todayStart.setHours(0, 0, 0, 0)
  todayStart = todayStart.toISOString().replace('T', ' ')

  let todayEnd: Date | string = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  todayEnd = todayEnd.toISOString().replace('T', ' ')

  try {
    const habits = (await pb
      .collection('habits')
      .getFullList({ fields: 'id,habit_name,habit_color,' })) as Habit[]

    const activities = (await pb.collection('activities').getFullList({
      filter: `date >= '${todayStart}' && date <= '${todayEnd}'`,
      fields: 'id,habit_id,date',
    })) as Activity[]

    const mappedHabits = mapHabits(habits, activities)
    return { success: true, data: mappedHabits }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch habits' }
  }
}

export async function logActivity(habit_id: string): Promise<Result> {
  if (!pb.authStore.record) return { success: false, error: 'No user logged in' }

  try {
    const entry = {
      habit_id,
      date: new Date().toISOString(),
      user_id: pb.authStore.record.id,
    } as Activity

    await pb.collection('activities').create(entry)
    return { success: true, data: 'Successfully logged habit' }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to log habit' }
  }
}

export async function deleteActivity(activity_id: string): Promise<Result> {
  try {
    await pb.collection('activities').delete(activity_id)
    return {
      success: true,
      data: `Successfully deleted activity ${activity_id}`,
    }
  } catch (error) {
    console.error(error)
    return { success: false, error: `Unable to delete activity ${activity_id}` }
  }
}

export async function fetchActivities(): Promise<Result<MappedActivity[]>> {
  try {
    const activities = (await pb.collection('activities').getFullList({
      expand: 'habit_id ',
      fields: 'date,id,expand.habit_id.habit_color',
    })) as Activity[]

    const mappedActivities: MappedActivity[] = activities.map((activity) => {
      return {
        id: activity.id,
        date: activity.date,
        color: activity.expand?.habit_id.habit_color,
      }
    })

    return {
      success: true,
      data: mappedActivities,
    }
  } catch (error) {
    if (error instanceof ClientResponseError) console.error(error)
    return { success: false, error: 'Unable to fetch activities' }
  }
}

export async function fetchSummary(): Promise<Result<SummaryMap[]>> {
  try {
    const [habits, activities] = await Promise.all([
      pb.collection('habits').getFullList({ fields: 'id,habit_name,habit_color' }),
      pb.collection('activities').getFullList({ fields: 'id,habit_id,date' }),
    ])
    console.log('*** POCKETBASE QUERIES ***')
    console.log(habits, activities)

    // map habits and activities together
    /* I need to know the activity % of total for each habit */
    const map: SummaryMap[] = []
    habits.forEach((habit) => {
      const filtered = activities.filter((activity) => activity.habit_id === habit.id)

      map.push({
        habit_id: habit.id,
        habit_name: habit.habit_name,
        habit_color: habit.habit_color,
        activity_percent: filtered.length / activities.length,
      })
    })
    console.log(map)

    return { success: true, data: map }
  } catch (error) {
    if (error instanceof ClientResponseError) console.error(error)
    return { success: false, error: 'Unable to fetch habits summary' }
  }
}

// let colors: { [key: string]: { total: number; count: number } } = {}

// mappedActivities.forEach((activity) => {
//   const date = new Date(activity.date).toLocaleString().split(',')[0]
//   const colorInt = parseInt(activity.color.split('#')[1], 16)
//   if (!colors[date]) {
//     colors = { ...colors, [date]: { total: colorInt, count: 1 } }
//   } else {
//     colors = {
//       ...colors,
//       [date]: {
//         total: colors[date].total + colorInt,
//         count: colors[date].count + 1,
//       },
//     }
//   }
// })

// const gradientSteps: string[] = []
// const dates = Object.keys(colors).sort()
// dates.forEach((k) => {
//   const c = Math.trunc(colors[k].total / colors[k].count)
//   gradientSteps.push(`#${Number(c).toString(16)}`)
// })

// const cssGradient = tinygradient(gradientSteps).css()
// const extended = tinygradient(mappedActivities.map((a) => a.color)).css('linear', '45deg')
// console.log(gradientSteps)
// console.log(cssGradient)
