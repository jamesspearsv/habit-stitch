import { Result, SyncOperation } from '@shared/types'
import { HabitSchema, LogSchema } from '@shared/zod'
import { eq } from 'drizzle-orm'
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
      .values({ ...safePayload.data })
      .onConflictDoUpdate({ target: dbTable.id, set: safePayload.data })
  }

  if (action === 'delete') {
    const safePayload = z.uuid().safeParse(payload)

    if (!safePayload.success) return { success: false, message: 'Bad load' }

    await db.delete(dbTable).where(eq(dbTable.id, payload_id))
  }

  return { success: true, data: 'Successfully completed operation' }
}
