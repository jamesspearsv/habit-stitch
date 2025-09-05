import { Hono } from 'hono'
import { insertUser } from './queries'
import bcryptjs from 'bcryptjs'
import { sign } from 'hono/jwt'
import { ZodError } from 'zod'
import { NewUser } from '../shared/zod'
import { AuthRouteResponse } from '../shared/types'

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

// User creation POST route
api.post('/users', async (c) => {
  try {
    const binding = c.env.DB
    const json = await c.req.json()
    console.log(json)

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
    } satisfies AuthRouteResponse

    return c.json(res)
  } catch (err) {
    if (err instanceof ZodError) {
      console.log(err.message)
      return c.json({ message: 'Bad request' }, 400)
    }

    if (err instanceof Error) {
      return c.json({ message: err.message }, 500)
    }
  }
})

// User login POST route
api.post('/login', async (c) => {
  // TODO: Implement login logic
  // validate request body
  // if (!valid request) return unsuccessful
  // check for existing user
  // if (!valid user) return unsuccessful
  // compare password to hashed_password
  // if (!valid password) return unsuccessful
  // else return {success, message, authObject}

  const json = await c.req.json()

  const parsedRequest = NewUser.omit({ name: true }).safeParse(json)

  const response = { success: false, message: '' } satisfies AuthRouteResponse
  return c.json(response)
})
