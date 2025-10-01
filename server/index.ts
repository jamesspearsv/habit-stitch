import { resetAndSeedDB } from './drizzleQueries'
import { newHono } from './utils'
import { auth } from './routers/authRoutes'
import { sync } from './routers/syncRoutes'

// Cloudflare D1 and Hono guides
// https://developers.cloudflare.com/d1/worker-api/d1-database/
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings
// https://developers.cloudflare.com/d1/examples/d1-and-hono/

const app = newHono()

app.onError((error, c) => {
  console.error(error)
  return c.json({ message: error instanceof Error ? 'Server error' : 'Unknown error' }, 500)
})

app.route('/auth', auth)
app.route('/sync', sync)

app.get('/seed', async (c) => {
  if (import.meta.env.DEV) {
    await resetAndSeedDB(c.env.DB)
  }
  return c.json({ message: 'Action complete' })
})

export default app
