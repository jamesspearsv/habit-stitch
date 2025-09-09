import { resetAndSeedDB } from './queries'
import { newHono } from './utils'

export const api = newHono()

// TODO: Add api middleware to verify authentication

api.get('/seed', async (c) => {
  if (import.meta.env.DEV) {
    await resetAndSeedDB(c.env.DB)
  }
  return c.json({ message: 'Action complete' })
})
