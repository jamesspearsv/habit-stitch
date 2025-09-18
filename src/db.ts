import type { Habit, Log } from '@shared/types'
import Dexie, { type EntityTable } from 'dexie'

const db = new Dexie('habitstitch-db') as Dexie & {
  habits: EntityTable<Habit, 'id'>
  log: EntityTable<Log, 'id'>
}

db.version(1).stores({ habits: '++id, name' })

export { db }
