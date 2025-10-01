import { insertLog, selectHabits } from '../drizzleQueries'
import { newHono, parseJWT } from '../utils'
import { jwt } from 'hono/jwt'
import { HabitsResponse, LogResponse } from '../../shared/types'

export const api = newHono()

// JWT verification middleware
// * Consider writing a custom middleware
// * to return more contextual HTTP status
// * code that clients can use to interpret
// * endpoint responses
api.use(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.SECRET_KEY,
  })

  return jwtMiddleware(c, next)
})

api.get('/hello-world', (c) => {
  return c.json({ hello: 'world!' })
})

api.get('habits', async (c) => {
  // Get jwt payload
  const payload = parseJWT(c)

  if (!payload.success) {
    return c.json({ success: false, message: 'Server error' })
  }
  const habits = await selectHabits(payload.data.user.id, c.env.DB)

  if (!habits.success) {
    return c.json({ success: false, message: 'Unable to select habits' } satisfies HabitsResponse)
  }

  return c.json({ success: true, data: habits.data } satisfies HabitsResponse)
})

api.post('/habits/:id/log', async (c) => {
  // Validate habit id from request params
  const { id } = c.req.param()
  const habitID = parseInt(id)
  if (isNaN(habitID))
    return c.json({ success: false, message: 'Invalid request' } satisfies LogResponse, 400)

  // 1. Extract user credentials from JWT
  const payload = parseJWT(c)
  if (payload.success) {
    // 2. Validate the habit id
    const habit = await selectHabits(payload.data.user.id, c.env.DB, { habitID })

    if (!habit.success) {
      return c.json({ success: false, message: 'ID not found' } satisfies LogResponse, 400)
    }
    // 3. Insert the new log row
    const log = await insertLog(payload.data.user.id, habitID, c.env.DB)

    if (!log.success) {
      return c.json({ success: false, message: 'Unable to log habit' } satisfies LogResponse, 500)
    }

    return c.json({ success: true, data: 'Logged habit' } satisfies LogResponse)
  }

  return c.json({ success: false, message: 'Bad request' } satisfies LogResponse, 400)
})
