import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { users } from './schema'

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

    // TODO: validate new user data
    if ('email' in json && 'password' in json && 'name' in json) {
      const user = {
        email: json.email as string,
        hashed_password: json.password as string,
        name: json.name as string,
      }

      // init db connection & insert new user
      console.log('attempting db connection...')
      const db = drizzle(binding)

      console.log('attempting insert...')
      await db.insert(users).values(user)
    }

    return c.json({ message: 'work in progress' })
  } catch (err) {
    if (err instanceof Error) {
      return c.json({ message: err.message })
    }
  }
})
