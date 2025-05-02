import { pb } from '@/lib/pb'
import type { Activity, Habit, MappedHabit, Result } from '@/lib/types'
import { ClientResponseError } from 'pocketbase'

function mapHabits(habits: Habit[], activities: Activity[]) {
  const map: MappedHabit[] = []

  habits.forEach((habit) => {
    // Filter activities for those that match the current habit
    const activity = activities.filter((activity) => activity.habit_id === habit.id)[0]

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

export async function createHabit(data: {
  habit_name: string
  habit_goal: number
}): Promise<Result> {
  if (!pb.authStore.record) return { success: false, error: 'No logged in user' }

  const habit = {
    habit_name: data.habit_name,
    habit_goal: data.habit_goal,
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
      .getFullList({ fields: 'id,habit_name,habit_goal,' })) as Habit[]

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
    console.log(habit_id)
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
