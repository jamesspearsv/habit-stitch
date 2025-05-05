export type Result<T = string> = { success: true; data: T } | { success: false; error: string }

// TODO: Update habit and activity type definitions
export interface Habit {
  id: string
  habit_name: string
  habit_color: string
  user_id: string
}

export interface Activity {
  id: string
  habit_id: string
  date: string
  user_id: string
}

export interface MappedHabit {
  id: string
  habit_name: string
  habit_color: string
  completed_date: string
  activity_id: string
}
