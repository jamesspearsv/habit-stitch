import PocketBase from 'pocketbase'
import type { Activity, Habit, MappedHabit, Result } from '@/lib/types'
export const pb = new PocketBase('http://localhost:8080')

function mapHabits(habits: Habit[], activities: Activity[]) {
  const map: MappedHabit[] = []

  habits.forEach((habit) => {
    // todo: finish mapping function
    // separate the temp storage variable and the mapping function
    const activity = activities.filter((activity) => activity.habit_id === habit.id)[0]

    console.log(activity)

    map.push({
      id: habit.id,
      habit_name: habit.habit_name,
      habit_goal: habit.habit_goal,
      completed_date: activity ? activity.date : '',
      activity_id: activity ? activity.id : '',
    })
  })

  return map
}

export async function fetchHabits(): Promise<Result<MappedHabit[]>> {
  let todayStart: Date | string = new Date()
  todayStart.setHours(0, 0, 0, 0)
  todayStart = todayStart.toISOString().replace('T', ' ')

  let todayEnd: Date | string = new Date()
  todayEnd.setHours(23, 59, 59, 999)
  todayEnd = todayEnd.toISOString().replace('T', ' ')

  console.log('today:', todayStart, todayEnd)

  try {
    const habits = (await pb
      .collection('habits')
      .getFullList({ fields: 'id,habit_name,habit_goal,' })) as Habit[]

    const activities = (await pb.collection('activities').getFullList({
      filter: `date >= '${todayStart}' && date <= '${todayEnd}'`,
      fields: 'id,habit_id,date',
    })) as Activity[]

    // console.log(habits)
    // console.log(activities)

    const mappedHabits = mapHabits(habits, activities)
    console.log(mappedHabits)
    return { success: true, data: mappedHabits }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch habits' }
  }
}

export async function logActivity(habit_id: string): Promise<Result> {
  try {
    console.log(habit_id)
    const entry = {
      habit_id,
      date: new Date().toISOString(),
    }
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
