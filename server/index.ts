import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { env } from 'cloudflare:workers'

type Bindings = {
  DB: D1Database
}

const db = drizzle(env.DB)

const app = new Hono<{ Bindings: Bindings }>()

// Cloudflare D1 and Hono guides
// https://developers.cloudflare.com/d1/worker-api/d1-database/
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings
// https://developers.cloudflare.com/d1/examples/d1-and-hono/

app.get('/api/createTable', async (c) => {
  console.log(c.env.DB)
  const stmt = `CREATE TABLE IF NOT EXISTS habits (name TEXT, completion_goal INTEGER);`
  const query = c.env.DB.prepare(stmt)

  try {
    await query.run()
    return c.json({ message: 'Table created' })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      return c.json({ message: error.message })
    }
  }
})

app.get('/api/insertRow', async (c) => {
  const query = c.env.DB.prepare(
    `INSERT INTO habits (name, completion_goal) VALUES ('Workout', 10);`,
  )

  try {
    await query.run()
    return c.json({ message: 'Row inserted into habits' })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      return c.json({ message: error.message })
    }
  }
})

app.get('/api', (c) => c.json({ message: 'Hello from Cloudflare Workers!' }))

export default app
