export type Result<T = string> = { success: true; data: T } | { success: false; error: string }

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
  expand?: { habit_id: { habit_color } }
}

export interface MappedHabit {
  id: string
  habit_name: string
  habit_color: string
  completed_date: string
  activity_id: string
}

export interface MappedActivity {
  id: string
  date: string
  color: string
}

export interface SummaryMap {
  habit_id: string
  habit_name: string
  habit_color: string
  activity_percent: number
  activity_total: number
}
