import Dexie from 'dexie'
import type { DexieDatabase } from '@shared/types'
import { SyncLayer } from './dexieSync'

const db = new Dexie('HabitStitchDB') as DexieDatabase

db.version(1).stores({
  habits: '&id, name',
  logs: '&id, created_on, user_id, habit_id',
  syncQueue: '&id, timestamp, payload_id',
})

// Seed initial data
// db.habits.add({
//   id: 'b4484a6a-8990-41d1-b3d3-c4ec9f134964',
//   name: 'Learn Dexie',
//   description: null,
//   color: '#eeeeee',
//   interval_days: 0,
//   is_active: true,
//   created_on: '2025-09-20',
//   user_id: 1,
// })

// db.logs.add({
//   id: '4c8f95ba-e320-439f-bd4b-10c01f7cdcce',
//   created_on: '2025-09-21',
//   user_id: 1,
//   notes: '',
//   habit_id: 'b4484a6a-8990-41d1-b3d3-c4ec9f134964',
//   sync_status: false,
// })

// Init new sync manager instance to manage sync queue and operations
const sync = new SyncLayer(db)

export { db, sync }
