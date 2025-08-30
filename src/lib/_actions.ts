import type { MappedActivity, MappedHabit, Result, SummaryMap } from '@/lib/types'
import { getDateRange } from './helpers'

// function mapHabits(habits: Habit[], activities: Activity[]) {
//   const map: MappedHabit[] = []

//   habits.forEach((habit) => {
//     // Filter activities for those that match the current habit
//     const activity = activities.filter((activity) => activity.habit_id === habit.id)[0]

//     map.push({
//       id: habit.id,
//       habit_name: habit.habit_name,
//       habit_color: habit.habit_color,
//       completed_date: activity ? activity.date : '',
//       activity_id: activity ? activity.id : '',
//     })
//   })
//   return map
// }

export async function createHabit(data: { habit_name: string }): Promise<Result> {
  const habit = {
    habit_name: data.habit_name,
    user_id: '',
  }

  try {
    console.log(habit)
    throw Error('dev error')
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return { success: false, error: 'Unable to create habit' }
  }
}

export async function fetchHabits(): Promise<Result<MappedHabit[]>> {
  const today = getDateRange('today')

  try {
    console.log(today)
    throw new Error()
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to fetch habits' }
  }
}

export async function fetchActivities(): Promise<Result<MappedActivity[]>> {
  const today = getDateRange('today')
  try {
    console.log(today)
    throw new Error()
  } catch (error) {
    if (error instanceof Error) console.error(error)
    return { success: false, error: 'Unable to fetch activities' }
  }
}

export async function logActivity(habit_id: string): Promise<Result> {
  try {
    console.log(habit_id)
    throw new Error()
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Failed to log habit' }
  }
}

export async function deleteActivity(activity_id: string): Promise<Result> {
  try {
    throw new Error()
  } catch (error) {
    console.error(error)
    return { success: false, error: `Unable to delete activity ${activity_id}` }
  }
}

export async function fetchSummary(
  period: 'week' | 'month' | 'today',
  offset?: number,
): Promise<Result<SummaryMap[]>> {
  const range = getDateRange(period, offset)

  try {
    console.log(range)
    throw new Error()
  } catch (error) {
    if (error instanceof Error) console.error(error)
    return { success: false, error: 'Unable to fetch habits summary' }
  }
}
