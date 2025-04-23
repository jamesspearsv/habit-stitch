export interface Habit {
  id: string
  name: string
  monthly_goal: number
}

export interface HabitCheck {
  id: string
  task_id: string
  date: string // ISO date string
}

export const Habits: Habit[] = [{ id: 'ef23d82e', name: 'Practice Vue.js', monthly_goal: 10 }]

export const HabitChecks: HabitCheck[] = []
