import type { Habit, Log } from '@shared/types'
import Dexie, { type EntityTable } from 'dexie'

const db = new Dexie('HabitStitchDB') as Dexie & {
  habits: EntityTable<Habit, 'id'>
  log: EntityTable<Log, 'id'>
}

db.version(1).stores({ habits: 'id, name' })

// Load initial data
db.habits.add({
  id: 'b4484a6a-8990-41d1-b3d3-c4ec9f134964',
  name: 'Learn Dexie',
  description: null,
  color: '#eeeeee',
  interval_days: 0,
  is_active: true,
  created_at: '2025-09-17',
  user_id: 1,
})

export { db }
