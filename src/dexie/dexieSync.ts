import { db } from '@client/dexie/dexieSchema'
import type { SyncOperation } from '@shared/types'

export async function insertIntoSyncQueue(
  sync: Pick<SyncOperation, 'action' | 'table' | 'payload_id' | 'payload'>,
) {
  // Search sync queue for existing changes to the given row
  const row = await db.syncQueue.where('payload_id').equals(sync.payload_id).first()

  if (row) {
    await db.syncQueue.update(row.id, {
      action: sync.action,
      timestamp: Date.now(),
      payload_id: sync.payload_id,
      payload: sync.payload,
    })
  } else {
    await db.syncQueue.add({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      status: false,
      action: sync.action,
      table: sync.table,
      payload_id: sync.payload_id,
      payload: sync.payload,
    })
  }
}
