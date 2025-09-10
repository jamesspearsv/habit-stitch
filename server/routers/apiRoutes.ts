import { newHono } from '../utils'
import { jwt } from 'hono/jwt'

export const api = newHono()

// TODO: Add api middleware to verify authentication
// api.use(async (c) => {
//   const authorization = c.req.header('Authorization')
//   if (!authorization) {
//     return c.json({ success: false, message: 'Invalid request' } satisfies AuthResponse, 400)
//   }

//   const method = authorization.split(' ')[0]
//   const token = authorization.split('')[1]

//   if (method !== 'Bearer') {
//     return c.json({ success: false, message: 'Invalid request' } as AuthResponse, 400)
//   }

//   // verify JWT
// })

api.use(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.SECRET_KEY,
  })

  return jwtMiddleware(c, next)
})

api.get('/hello/world', (c) => {
  return c.json({ hello: 'world!' })
})
