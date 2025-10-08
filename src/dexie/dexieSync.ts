import type { DexieDatabase, Result, SyncOperation } from '@shared/types'
import { SyncPullResponseSchema } from '@shared/zodSchemas'
import type { EntityTable } from 'dexie'
import { success } from 'zod'

export class SyncLayer {
  private queue: EntityTable<SyncOperation, 'id'>
  private db: DexieDatabase
  private push_url_base = '/sync/push'
  private pull_url_base = '/sync/pull'
  private last_sync_key = 'habitstitch_last_sync'

  constructor(dexie_queue: typeof this.queue, db: typeof this.db) {
    this.queue = dexie_queue
    this.db = db
  }

  async pull(access_token: string): Promise<Result> {
    const last_sync = localStorage.getItem(this.last_sync_key)
    let endpoint = this.pull_url_base

    // Update endpoint if a last sync timestamps is present & valid
    if (last_sync && !isNaN(parseInt(last_sync))) {
      endpoint = `${this.pull_url_base}?timestamp=${parseInt(last_sync)}`
    }

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (!res.ok)
      return {
        success: false,
        message: 'Server error. Try again later',
      }

    const json = await res.json()

    const safe_json = SyncPullResponseSchema.safeParse(json)

    if (!safe_json.success)
      return {
        success: false,
        message: 'Server error. Bad response.',
      }

    if (!safe_json.data.success)
      return {
        success: false,
        message: 'Server error. Try again later.',
      }

    await this.db.habits.bulkPut(safe_json.data.habits)
    await this.db.logs.bulkPut(safe_json.data.logs)

    return { success: true, data: '' }
  }

  async push(access_token: string) {
    console.log(access_token)
  }

  async addToQueue(operation: Pick<SyncOperation, 'action' | 'table' | 'payload_id' | 'payload'>) {
    // Search sync queue for existing changes to the given row
    const row = await this.queue.where('payload_id').equals(operation.payload_id).first()

    if (row) {
      await this.queue.update(row.id, {
        action: operation.action,
        timestamp: Date.now(),
        payload_id: operation.payload_id,
        payload: operation.payload,
      })
    } else {
      await this.queue.add({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: false,
        action: operation.action,
        table: operation.table,
        payload_id: operation.payload_id,
        payload: operation.payload,
      })
    }
  }

  async removeFromQueue(operations: SyncOperation['id'][]) {
    await this.queue.bulkDelete(operations)
  }
}

// export async function insertIntoSyncQueue(
//   sync: Pick<SyncOperation, 'action' | 'table' | 'payload_id' | 'payload'>,
// ) {
//   // Search sync queue for existing changes to the given row
//   const row = await db.syncQueue.where('payload_id').equals(sync.payload_id).first()

//   if (row) {
//     await db.syncQueue.update(row.id, {
//       action: sync.action,
//       timestamp: Date.now(),
//       payload_id: sync.payload_id,
//       payload: sync.payload,
//     })
//   } else {
//     await db.syncQueue.add({
//       id: crypto.randomUUID(),
//       timestamp: Date.now(),
//       status: false,
//       action: sync.action,
//       table: sync.table,
//       payload_id: sync.payload_id,
//       payload: sync.payload,
//     })
//   }
// }
