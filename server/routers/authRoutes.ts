import { insertUser, selectUser } from '../queries'
import bcryptjs from 'bcryptjs'
import { NewUser } from '../../shared/zod'
import { AuthResponse } from '../../shared/types'
import { newHono, signJWT } from '../utils'

export const auth = newHono()

/*
 * *****************************
 * New user creation
 * method: POST
 * returns: `AuthRouteResponse`.
 * status: 400 if invalid
 * *****************************
 */
auth.post('/users', async (c) => {
  const binding = c.env.DB
  const jsonBody = await c.req.json()

  // Validate new user data, return if validation fails
  const safeNewUser = NewUser.safeParse(jsonBody)
  if (!safeNewUser.success) {
    return c.json({ success: false, message: 'Invalid request' } satisfies AuthResponse, 400)
  }

  // Verify if user already exists
  const existingUser = await selectUser(safeNewUser.data.email, c.env.DB)
  if (existingUser.success) {
    return c.json({ success: false, message: 'Email in use' } as AuthResponse, 401)
  }

  const hashed_password = await bcryptjs.hash(safeNewUser.data.password, 10)
  const user = {
    email: safeNewUser.data.email,
    hashed_password,
    name: safeNewUser.data.name,
  }

  // Insert new user and handle any errors
  const insertResult = await insertUser(user, binding)
  if (!insertResult.success) {
    return c.json({ success: false, message: 'Unable to create new account' } as AuthResponse, 500)
  }

  // sign new JWT & return
  const { jwt } = await signJWT(insertResult.data, c.env.SECRET_KEY)
  const { id, email, name, created_at } = insertResult.data

  return c.json({
    success: true,
    message: 'Successfully Created new user',
    authObject: {
      accessToken: jwt,
      user: { id, email, name, created_at },
    },
  } satisfies AuthResponse)
})

/*
 * ********************************************
 * User login
 * method: POST
 * Returns: `AuthRouteResponse`
 * Status: 400, 401 if unsuccessful
 * ********************************************
 */
auth.post('/login', async (c) => {
  const json = await c.req.json()
  console.log(json)

  // Parse & validate user credentials
  const safeCredentials = NewUser.omit({ name: true }).safeParse(json)
  if (!safeCredentials.success)
    return c.json(
      {
        success: false,
        message: 'Invalid request',
      } satisfies AuthResponse,
      400,
    )

  // Attempt to select user record from database
  const user = await selectUser(safeCredentials.data.email, c.env.DB)

  if (!user.success)
    return c.json(
      { success: false, message: 'Invalid email or password' } satisfies AuthResponse,
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
      } satisfies AuthResponse,
      401,
    )

  // Sign JWT and create AuthObject
  const { jwt } = await signJWT(user.data, c.env.SECRET_KEY)
  const { id, email, name, created_at } = user.data

  return c.json({
    success: true,
    message: 'User logged in',
    authObject: {
      accessToken: jwt,
      user: {
        id,
        email,
        name,
        created_at,
      },
    },
  } satisfies AuthResponse)
})
