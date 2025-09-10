import { Hono } from 'hono'
import { sign, type JwtVariables } from 'hono/jwt'
import { users } from './schema'

type Bindings = {
  DB: D1Database
  SECRET_KEY: string
}

type Variables = JwtVariables

/**
 * Utility function to sign and create JWT
 * @param user
 * @param secretKey
 * @returns JWT token and creation timestamp
 */
export async function signJWT(
  user: Omit<typeof users.$inferSelect, 'hashed_password'>,
  secretKey: string,
) {
  const timestamp = Math.trunc(Date.now() / 1000)
  const { id, email, name, created_at } = user
  const jwt = await sign(
    { user: { id, email, name, created_at }, exp: timestamp + 3 * 3600, iat: timestamp },
    secretKey,
  )

  return { jwt, timestamp }
}

/**
 * Utility function to create a new Hono instance with correct CF bindings
 * @returns New Hono instance
 */
export function newHono() {
  return new Hono<{ Bindings: Bindings; Variables: Variables }>()
}
