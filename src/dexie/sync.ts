import { db } from '@client/dexie/db'

export async function checkSyncStatus(): Promise<'fresh' | 'stale' | 'undefined'> {
  const now = Date.now()
  const result = await db.sync.orderBy('timestamp').last()

  if (!result) return 'undefined'
  if (now - result.timestamp > 60000) return 'stale'
  return 'fresh'
}
