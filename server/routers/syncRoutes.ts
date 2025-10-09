import { jwt } from 'hono/jwt'
import { newHono } from '../utils'
import { SyncQueueSchema } from '@shared/zodSchemas'
import { SyncOperation, SyncPullResponse, SyncPushResponse } from '@shared/types'
import { handleSyncOperation, selectHabits, selectLogs } from '../queries/syncQueries'

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
    return c.json({ success: false, message: 'Bad request' } satisfies SyncPushResponse, 403)
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

// /sync/pull?timestamp=1234567890
sync.get('/pull', async (c) => {
  const { user } = c.get('jwtPayload')
  const { timestamp } = c.req.query()

  const safe_timestamp = parseInt(timestamp)

  if (isNaN(safe_timestamp))
    return c.json({ success: false, message: 'Bad request' } as SyncPullResponse, 400)

  const habits_promise = selectHabits(user.id, safe_timestamp, c.env.DB)
  const logs_promise = selectLogs(user.id, safe_timestamp, c.env.DB)

  const [habits, logs] = await Promise.all([habits_promise, logs_promise])

  return c.json({ success: true, message: 'success!', habits, logs } satisfies SyncPullResponse)
})
