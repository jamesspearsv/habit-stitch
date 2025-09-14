import { selectHabits } from '../queries'
import { newHono, parseJWT } from '../utils'
import { jwt } from 'hono/jwt'
import { HabitsResponse } from '../../shared/types'

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
