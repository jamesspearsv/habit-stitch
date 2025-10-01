import { jwt } from 'hono/jwt'
import { newHono } from '../utils'
import { SyncQueueSchema } from '@shared/zod'
import { SyncQueue } from '@shared/types'
import { handleSyncOperation } from '../drizzleQueries'

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

  // Loop through sync queue, attempt to apply each operation
  const failedOperations: SyncQueue = []

  for await (const op of safeBody.data) {
    // parse single operation and compose drizzle logic
    try {
      await handleSyncOperation(op, c.env.DB)
    } catch (error) {
      failedOperations.push(op)
      console.error(error)
    }
  }

  return c.json({ message: 'Push: Work in progress' })
})
