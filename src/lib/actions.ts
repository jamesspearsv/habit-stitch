import { pb } from '@/lib/pb'
import type { Activity, Habit, MappedActivity, MappedHabit, Result, SummaryMap } from '@/lib/types'
import { ClientResponseError } from 'pocketbase'
import { newGetDateRange } from './helpers'

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
  const today = newGetDateRange('today')

  try {
    const habits = (await pb
      .collection('habits')
      .getFullList({ fields: 'id,habit_name,habit_color,' })) as Habit[]

    const activities = (await pb.collection('activities').getFullList({
      filter: `date >= '${today.start}' && date <= '${today.end}'`,
      fields: 'id,habit_id,date',
    })) as Activity[]

    const mappedHabits = mapHabits(habits, activities)
    return { success: true, data: mappedHabits }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch habits' }
  }
}

export async function fetchActivities(): Promise<Result<MappedActivity[]>> {
  const today = newGetDateRange('today')
  try {
    const activities = (await pb.collection('activities').getFullList({
      expand: 'habit_id ',
      fields: 'date,id,expand.habit_id.habit_color',
      filter: `date >= '${today.start}' && date <= '${today.end}'`,
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

export async function fetchSummary(): Promise<Result<SummaryMap[]>> {
  const range = newGetDateRange('week')

  try {
    const [habits, activities] = await Promise.all([
      pb.collection('habits').getFullList({ fields: 'id,habit_name,habit_color' }),
      pb.collection('activities').getFullList({
        fields: 'id,habit_id,date',
        filter: `date >= '${range.start}' && date <= '${range.end}'`,
      }),
    ])

    const map: SummaryMap[] = []
    habits.forEach((habit) => {
      const filtered = activities.filter((activity) => activity.habit_id === habit.id)

      map.push({
        habit_id: habit.id,
        habit_name: habit.habit_name,
        habit_color: habit.habit_color,
        activity_percent: filtered.length / activities.length,
        activity_total: filtered.length,
      })
    })

    map.sort((a, b) => b.activity_percent - a.activity_percent)

    return { success: true, data: map }
  } catch (error) {
    if (error instanceof ClientResponseError) console.error(error)
    return { success: false, error: 'Unable to fetch habits summary' }
  }
}
