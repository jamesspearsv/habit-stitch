import { Hono } from 'hono'
import { api } from './api'

// Cloudflare D1 and Hono guides
// https://developers.cloudflare.com/d1/worker-api/d1-database/
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings
// https://developers.cloudflare.com/d1/examples/d1-and-hono/

const app = new Hono()
// TODO: Update app.onError handler
app.onError((error, c) => {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}\n${error}`)
    return c.json({ message: 'Server error' }, 500)
  } else {
    return c.json({ message: 'Unknown error' }, 500)
  }
})
app.route('/api', api)
export default app
