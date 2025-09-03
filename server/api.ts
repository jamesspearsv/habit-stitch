import { Hono } from 'hono'
import { insertUser } from './queries'
import bcryptjs from 'bcryptjs'
import { NewUser } from './zod'

type Bindings = {
  DB: D1Database
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

    return c.json({ message: 'work in progress' })
  } catch (err) {
    if (err instanceof Error) {
      return c.json({ message: err.message })
    }
  }
})
