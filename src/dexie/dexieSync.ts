import type { DexieDatabase, Result, SyncOperation } from '@shared/types'
import { SyncPullResponseSchema, SyncPushResponseSchema } from '@shared/zodSchemas'

export class SyncLayer {
  private db: DexieDatabase
  private push_url_base = '/sync/push'
  private pull_url_base = '/sync/pull'
  private last_sync_key = 'habitstitch_last_sync'

  constructor(db: typeof this.db) {
    this.db = db
  }

  /**
   * Pull fresh data from remote server
   * @param access_token
   * @returns Current number of unsaved changes in a result object
   */
  async pull(access_token: string): Promise<Result<number>> {
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

    return { success: true, data: (await this.db.syncQueue.toArray()).length }
  }
  /**
   * Push local changes to remote database
   * @param access_token
   * @returns Number of failed operations in a result object
   */
  async push(access_token: string): Promise<Result<number>> {
    const queue = await this.db.syncQueue.orderBy('timestamp').toArray()

    if (queue.length < 1)
      return {
        success: false,
        message: 'No changes to sync',
      }

    const res = await fetch(this.push_url_base, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(queue),
    })

    if (!res.ok)
      return {
        success: false,
        message: 'Server error. Try again later.',
      }

    const json = await res.json()
    const safe_json = SyncPushResponseSchema.safeParse(json)

    if (!safe_json.success)
      return {
        success: false,
        message: 'Bad response.',
      }

    if (!safe_json.data.success)
      return {
        success: false,
        message: 'Server error. Try again later.',
      }

    await this.db.syncQueue.bulkDelete(safe_json.data.successful_operations)

    return {
      success: true,
      data: safe_json.data.failed_operations.length,
    }
  }

  /**
   * Add new changes to the Dexie sync queue
   * @param operation
   * @returns Number of changes in the sync queue
   */
  async addToQueue(operation: Pick<SyncOperation, 'action' | 'table' | 'payload_id' | 'payload'>) {
    // Search sync queue for existing changes to the given row
    const row = await this.db.syncQueue.where('payload_id').equals(operation.payload_id).first()

    if (row) {
      await this.db.syncQueue.update(row.id, {
        action: operation.action,
        timestamp: Date.now(),
        payload_id: operation.payload_id,
        payload: operation.payload,
      })
    } else {
      await this.db.syncQueue.add({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: false,
        action: operation.action,
        table: operation.table,
        payload_id: operation.payload_id,
        payload: operation.payload,
      })
    }

    return (await this.db.syncQueue.toArray()).length
  }

  async removeFromQueue(operations: SyncOperation['id'][]) {
    await this.db.syncQueue.bulkDelete(operations)
  }

  async getQueue() {
    return await this.db.syncQueue.orderBy('timestamp').toArray()
  }
}
