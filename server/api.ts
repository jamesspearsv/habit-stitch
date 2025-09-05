import { Hono } from 'hono'
import { insertUser } from './queries'
import bcryptjs from 'bcryptjs'
import { sign } from 'hono/jwt'
import { ZodError } from 'zod'
import { NewUser } from '../shared/zod'
import { CreateUserResponse } from '../shared/types'

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
    const timestamp = Date.now()
    const jwt = await sign(
      {
        user: { email: user.email, name: user.name },
        exp: timestamp + 180 * 60 * 1000,
        iat: timestamp,
      },
      c.env.SECRET_KEY,
    )

    const res = {
      success: true,
      message: 'Successfully Created new user',
      authObject: {
        accessToken: jwt,
        userName: user.name,
        userEmail: user.email,
        issuedAt: timestamp,
      },
    } satisfies CreateUserResponse

    return c.json(res)
  } catch (err) {
    if (err instanceof ZodError) {
      return c.json({ message: 'Bad request' }, 400)
    }

    if (err instanceof Error) {
      return c.json({ message: err.message }, 500)
    }
  }
})
