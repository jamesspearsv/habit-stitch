import type { Habit, Log, User } from '@shared/types'
import { db } from './dexieSchema'
import { parseDate } from '@client/lib/helpers'
import { insertIntoSyncQueue } from './dexieSync'

//* SELECT OPERATIONS
export async function selectLogs(date: string) {
  const result = await db.logs.where('created_on').equals(date).toArray()
  return result
}

export async function selectSyncQueue() {
  const result = await db.sync.orderBy('timestamp').toArray()
  return result
}

//* INSERT OPERATIONS
export async function insertLog(user_id: User['id'], habit_id: Habit['id'], day: string) {
  const row_id = crypto.randomUUID()
  const log: Log = {
    id: row_id,
    habit_id,
    created_on: day,
    notes: '',
    user_id,
  }

  await db.logs.add(log)
  await insertIntoSyncQueue({
    action: 'create',
    table: 'logs',
    payload_id: row_id,
    payload: log,
  })
}

export async function insertHabit(
  user_id: User['id'],
  formData: Pick<Habit, 'name' | 'description' | 'interval_days'>,
) {
  const row_id = crypto.randomUUID()

  const habit = {
    ...formData,
    color: '#123456',
    is_active: true,
    created_on: parseDate(new Date()),
    user_id,
    id: row_id,
    sync_status: false,
  }

  await db.habits.add(habit)

  await insertIntoSyncQueue({
    action: 'create',
    table: 'habits',
    payload_id: row_id,
    payload: habit,
  })
}

//* DELETE OPERATIONS
export async function deleteLog(id: Log['id']) {
  await db.logs.delete(id)
  await insertIntoSyncQueue({
    action: 'delete',
    table: 'logs',
    payload_id: id,
    payload: id,
  })
}

export async function clearSyncQueue(successful_operations: string[]) {
  for (const op of successful_operations) {
    await db.sync.delete(op)
  }
}
