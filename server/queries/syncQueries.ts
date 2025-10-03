import { Result, SyncOperation, User } from '@shared/types'
import { HabitSchema, LogSchema } from '@shared/zod'
import { and, eq, gt } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { habits, logs } from '../drizzleSchema'
import z from 'zod'

export async function handleSyncOperation(
  operation: SyncOperation,
  binding: D1Database,
): Promise<Result> {
  const db = drizzle(binding)
  const { action, table, payload, payload_id } = operation
  const dbTable = operation.table === 'habits' ? habits : logs

  if (action === 'create' || action === 'update') {
    const safePayload =
      table === 'habits' ? await HabitSchema.safeParse(payload) : await LogSchema.safeParse(payload)

    if (!safePayload.success) return { success: false, message: 'Bad payload' }

    await db
      .insert(dbTable)
      .values(safePayload.data)
      .onConflictDoUpdate({ target: dbTable.id, set: safePayload.data })
  }

  if (action === 'delete') {
    const safePayload = z.uuid().safeParse(payload)

    if (!safePayload.success) return { success: false, message: 'Bad load' }

    await db.delete(dbTable).where(eq(dbTable.id, payload_id))
  }

  return { success: true, data: 'Successfully completed operation' }
}

export async function selectHabits(user_id: User['id'], timestamp: number, binding: D1Database) {
  const db = drizzle(binding)

  return await db
    .select()
    .from(habits)
    .where(and(eq(habits.user_id, user_id), gt(habits.last_modified, timestamp)))
}

export async function selectLogs(user_id: User['id'], timestamp: number, binding: D1Database) {
  const db = drizzle(binding)

  return await db
    .select()
    .from(logs)
    .where(and(eq(logs.user_id, user_id), gt(logs.last_modified, timestamp)))
}
