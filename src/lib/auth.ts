import type { AuthObject, Result } from '@shared/types'
import { AuthResponseSchema } from '@shared/zod'

const authStoreKey = 'habitstitch_auth'

/*
 * *************************
 * AUTH MANAGEMENT FUNCTIONS
 * **************************
 */

/**
 * Validate user data to create a new user record
 * @param name
 * @param email
 * @param password
 * @returns `boolean` value if user creation if successful or not
 */
export async function createUser(user: { name: string; email: string; password: string }) {
  // TODO: Move function to a response pattern return value
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(user),
  })

  // Handle unexpected response errors
  if (!res.ok) return false

  const json = await res.json()
  const parsedResponse = AuthResponseSchema.safeParse(json)

  // Check validation & request success
  if (!parsedResponse.success) return false
  if (!parsedResponse.data.success) return false

  // Store validated authObject
  storeAuth(parsedResponse.data.authObject)

  return true
}

/**
 * Validate and login a user
 * @param credentials Object containing user credentials
 * @returns `Result` indicating the result status
 */
export async function login(credentials: { email: string; password: string }): Promise<Result> {
  try {
    const res = await fetch('/api/login', {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    // console.log(await res.json())

    // Handle unsuccessful login attempt
    if (!res.ok) {
      if (res.status === 400 || res.status === 401) {
        const json = await res.json()
        const safeJSON = AuthResponseSchema.safeParse(json)
        if (safeJSON.success) return { success: false, message: safeJSON.data.message }
      }
    }

    // Handle successful login attempt
    const json = await res.json()
    console.log(res)
    console.log(json)
    const safeJSON = AuthResponseSchema.safeParse(json)
    if (safeJSON.success && safeJSON.data.success) {
      storeAuth(safeJSON.data.authObject)
      return { success: true, data: 'User logged in' }
    }

    // Return unsuccessful result as a fallback
    return { success: false, message: 'Server error' }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    }
    throw new Error('Unknown error')
  }
}

/*
 * ***********************
 * UTILITY AUTH FUNCTIONS
 * ***********************
 */

/**
 * Store authObject in local storage
 * @param authObject
 * @returns `void`
 */
export function storeAuth(authObject: AuthObject) {
  localStorage.setItem(authStoreKey, JSON.stringify(authObject))
}

/**
 * Checks the authStore value
 * @returns null | authObject
 */
export function isLoggedIn() {
  const value = localStorage.getItem(authStoreKey)
  if (value) {
    return JSON.parse(value)
  }

  console.log('No user is logged in')
  return null
}

export function logOut() {
  localStorage.removeItem(authStoreKey)
}
