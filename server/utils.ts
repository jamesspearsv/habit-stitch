import { Hono } from 'hono'
import { sign } from 'hono/jwt'

export type Bindings = {
  DB: D1Database
  SECRET_KEY: string
}

/**
 * Utility function to sign and create JWT
 * @param user
 * @param secretKey
 * @returns JWT token and creation timestamp
 */
export async function signJWT(user: { email: string; name: string }, secretKey: string) {
  const timestamp = Date.now()
  const jwt = await sign(
    {
      user: { email: user.email, name: user.name },
      exp: timestamp + 180 * 60 * 1000,
      iat: timestamp,
    },
    secretKey,
  )

  return { jwt, timestamp }
}

/**
 * Utility function to create a new Hono instance with correct CF bindings
 * @returns New Hono instance
 */
export function newHono() {
  return new Hono<{ Bindings: Bindings }>()
}
