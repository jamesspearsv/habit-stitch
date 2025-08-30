import { Hono } from 'hono'
const app = new Hono()

// Cloudflare D1 and Hono guides
// https://developers.cloudflare.com/d1/worker-api/d1-database/
// https://hono.dev/docs/getting-started/cloudflare-workers#bindings

app.get('/api', (c) => c.json({ message: 'Hello from Cloudflare Workers!' }))

export default app
