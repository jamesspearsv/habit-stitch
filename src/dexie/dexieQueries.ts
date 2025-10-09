import type { Habit, Log, User } from '@shared/types'
import { db, sync } from './dexieSchema'
import { parseDate } from '@client/lib/helpers'

//* SELECT OPERATIONS
export async function selectLogs(date: string) {
  const result = await db.logs.where('created_on').equals(date).toArray()
  return result
}

//* INSERT OPERATIONS
export async function insertLog(user_id: User['id'], habit_id: Habit['id'], date: Date) {
  const row_id = crypto.randomUUID()
  const { date_string, timestamp } = parseDate(date)

  const log: Log = {
    id: row_id,
    habit_id,
    created_on: date_string,
    user_id,
    last_modified: timestamp,
  }

  await db.logs.add(log)

  return await sync.addToQueue({
    action: 'create',
    table: 'logs',
    payload_id: row_id,
    payload: log,
  }, )
}

export async function insertHabit(
  user_id: User['id'],
  formData: Pick<Habit, 'name' | 'description'>,
) {
  const row_id = crypto.randomUUID()
  const { date_string, timestamp } = parseDate(new Date())

  const habit = {
    ...formData,
    color: '#123456',
    is_active: true,
    created_on: date_string,
    user_id,
    id: row_id,
    sync_status: false,
    last_modified: timestamp,
  }

  await db.habits.add(habit)

  return await sync.addToQueue({
    action: 'create',
    table: 'habits',
    payload_id: row_id,
    payload: habit,
  })
}

//* DELETE OPERATIONS
export async function deleteLog(id: Log['id']) {
  await db.logs.delete(id)

  return await sync.addToQueue({
    action: 'delete',
    table: 'logs',
    payload_id: id,
    payload: id,
  })
}
