import { Hono } from 'hono'
import { auth } from './authRoutes'
import { api } from './apiRoutes'

// Cloudflare D1 and Hono guides
// https://developers.cloudflare.com/d1/worker-api/d1-database/
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings
// https://developers.cloudflare.com/d1/examples/d1-and-hono/

const app = new Hono()
app.onError((error, c) => {
  return c.json({ message: error instanceof Error ? 'Server error' : 'Unknown error' }, 500)
})

app.route('/auth', auth)
app.route('/api', api)
export default app
