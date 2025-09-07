import { Hono } from 'hono'
import { insertUser, selectUser } from './queries'
import bcryptjs from 'bcryptjs'
import { sign } from 'hono/jwt'
import { NewUser } from '../shared/zod'
import { AuthRouteResponse } from '../shared/types'
import { DrizzleQueryError } from 'drizzle-orm'

/*
 * Using HTTP status cods with response status
 * Success: return 201 or 200 with body { success: true, data: ... } and 204 for no-body success.
 * Client error: return 4xx with body { success: false, error: { code, message details? } }.
 * Server error: return 5xx with body { success: false, error: { code: 'server_error', message: 'Server error' } }.
 * Do not return 200 with success: false for errors you can express as 4xx/5xx.
 */

type Bindings = {
  DB: D1Database
  SECRET_KEY: string
}

async function signJWT(user: { email: string; name: string }, secretKey: string) {
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

export const api = new Hono<{ Bindings: Bindings }>()

/*
 * ***********
 * API Routes
 * ***********
 */
api.get('/habits', async (c) => {
  return c.json({ message: 'Work in progress' })
})

api.post('/habits', async (c) => {
  const json = await c.req.json()

  console.log(json)
  return c.json({ message: 'Work in progress' })
})

// User creation POST route
api.post('/users', async (c) => {
  const binding = c.env.DB
  const jsonBody = await c.req.json()

  // Validate new user data, return if validation fails
  const safeNewUser = NewUser.safeParse(jsonBody)
  if (!safeNewUser.success) {
    return c.json({ success: false, message: 'Invalid request' } satisfies AuthRouteResponse, 400)
  }

  const hashed_password = await bcryptjs.hash(safeNewUser.data.password, 10)
  const user = {
    email: safeNewUser.data.email,
    hashed_password,
    name: safeNewUser.data.name,
  }

  // Insert new user and handle any errors
  try {
    await insertUser(user, binding)
  } catch (error) {
    // consider decoupling this catch block from drizzle
    // and normalizing query errors in queries.ts
    if (error instanceof DrizzleQueryError) {
      console.error(`====> Error\n`, error)
      return c.json(
        {
          success: false,
          message: 'Unable to create account. Try again.',
        } satisfies AuthRouteResponse,
        500,
      )
    }
    throw error
  }

  // sign new JWT & return
  const { jwt, timestamp } = await signJWT({ email: user.email, name: user.name }, c.env.SECRET_KEY)

  return c.json({
    success: true,
    message: 'Successfully Created new user',
    authObject: {
      accessToken: jwt,
      userName: user.name,
      userEmail: user.email,
      issuedAt: timestamp,
    },
  } satisfies AuthRouteResponse)
})

// User login POST route
api.post('/login', async (c) => {
  const json = await c.req.json()
  console.log(json)

  // Parse & validate user credentials
  const safeCredentials = NewUser.omit({ name: true }).safeParse(json)
  if (!safeCredentials.success)
    return c.json(
      {
        success: false,
        message: 'Invalid request',
      } satisfies AuthRouteResponse,
      400,
    )

  // Attempt to select user record from database
  const user = await selectUser(safeCredentials.data.email, c.env.DB)

  if (!user.success)
    return c.json(
      { success: false, message: 'Invalid email or password' } satisfies AuthRouteResponse,
      401,
    )

  // Compare user's hashed_password to submitted password
  const passwordsMatch = await bcryptjs.compare(
    safeCredentials.data.password,
    user.data.hashed_password,
  )
  if (!passwordsMatch)
    return c.json(
      {
        success: false,
        message: 'Invalid email or password',
      } satisfies AuthRouteResponse,
      401,
    )

  // Sign JWT and create AuthObject
  const { jwt, timestamp } = await signJWT(
    { email: user.data.email, name: user.data.name },
    c.env.SECRET_KEY,
  )

  return c.json({
    success: true,
    message: 'User logged in',
    authObject: {
      accessToken: jwt,
      userName: user.data.name,
      userEmail: user.data.email,
      issuedAt: timestamp,
    },
  } satisfies AuthRouteResponse)
})
