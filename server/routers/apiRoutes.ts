import { newHono } from '../utils'
import { jwt } from 'hono/jwt'

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
  const payload = c.get('jwtPayload')
  return c.json(payload)
})
