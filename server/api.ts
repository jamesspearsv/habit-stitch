import { Hono } from 'hono'
import { insertUser } from './queries'

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

    // TODO: validate new user data with Zod
    if ('email' in json && 'password' in json && 'name' in json) {
      const user = {
        email: json.email as string,
        hashed_password: json.password as string, // TODO: hash password
        name: json.name as string,
      }

      // TODO: handle potential errors
      await insertUser(user, binding)
    }

    return c.json({ message: 'work in progress' })
  } catch (err) {
    if (err instanceof Error) {
      return c.json({ message: err.message })
    }
  }
})
