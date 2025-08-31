import { Hono } from 'hono'
import { api } from './api'

// Cloudflare D1 and Hono guides
// https://developers.cloudflare.com/d1/worker-api/d1-database/
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings
// https://developers.cloudflare.com/d1/examples/d1-and-hono/

const app = new Hono()
app.route('/api', api)
export default app
