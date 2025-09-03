import { Hono } from 'hono'
import { insertUser } from './queries'
import bcryptjs from 'bcryptjs'
import { NewUser } from './zod'
import { decode, verify, sign } from 'hono/jwt'
import { ZodError } from 'zod'

type Bindings = {
  DB: D1Database
  SECRET_KEY: string
}

export const api = new Hono<{ Bindings: Bindings }>()

api.get('/habits', async (c) => {
  return c.json({ message: 'Work in progress' })
})

api.post('/habits', async (c) => {
  const json = await c.req.json()

  console.log(json)
  return c.json({ message: 'Work in progress' })
})

api.post('/users', async (c) => {
  try {
    const binding = c.env.DB
    const json = await c.req.json()

    // TODO: handle parsing safely
    const parsedData = NewUser.parse(json)

    const hashed_password = await bcryptjs.hash(parsedData.password, 10)

    const user = {
      email: parsedData.email,
      hashed_password,
      name: parsedData.name,
    }

    // TODO: handle potential errors
    await insertUser(user, binding)

    // sign new JWT & return
    // TODO: Consider using an auth library like BetterAuth
    const jwt = await sign(
      {
        user: { email: user.email, name: user.name },
        exp: Date.now() + 180 * 60 * 1000,
        iat: Date.now(),
      },
      c.env.SECRET_KEY,
    )

    return c.json({ message: 'Successfully created new user', jwt })
  } catch (err) {
    // TODO: Handle error gracefully when parsing
    if (err instanceof ZodError) {
      return c.json({ message: 'Bad request' }, 400)
    }

    if (err instanceof Error) {
      return c.json({ message: err.message }, 500)
    }
  }
})
