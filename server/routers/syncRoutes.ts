import { jwt } from 'hono/jwt'
import { newHono } from '../utils'
import { SyncQueueSchema } from '@shared/zod'
import { SyncOperation, SyncPushResponse } from '@shared/types'
import { handleSyncOperation } from '../queries/syncQueries'

export const sync = newHono()

sync.use(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.SECRET_KEY,
  })

  return jwtMiddleware(c, next)
})

sync.post('/push', async (c) => {
  // Validate request body
  const body = await c.req.json()
  const safeBody = SyncQueueSchema.safeParse(body)
  if (!safeBody.success) {
    return c.json({ success: false, message: 'Bad request' }, 403)
  }

  // Init array to hold id of successful, failed operations
  const successful_operations: SyncOperation['id'][] = []
  const failed_operations: SyncOperation['id'][] = []

  // Loop through sync queue, attempt to apply each operation
  for (const op of safeBody.data) {
    try {
      const result = await handleSyncOperation(op, c.env.DB)
      if (result.success) {
        successful_operations.push(op.id)
      }
    } catch (error) {
      console.error(error)
      failed_operations.push(op.id)
    }
  }

  return c.json({
    success: true,
    message: 'Completed queue processing',
    successful_operations,
    failed_operations,
  } as SyncPushResponse)
})

// TODO: Add /sync/pull route
