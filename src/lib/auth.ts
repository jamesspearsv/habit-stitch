import type { AuthObject, Result } from '@shared/types'
import { AuthObjectSchema, AuthResponseSchema } from '@shared/zod'

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
export async function createUser(user: {
  name: string
  email: string
  password: string
}): Promise<Result> {
  try {
    const res = await fetch('/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(user),
    })

    // Attempt to parse, validate response body
    const json = await res.json().catch(() => null)
    const safeJSON = AuthResponseSchema.safeParse(json)

    // Handle unsuccessful user creation
    if (!res.ok) {
      if (res.status === 400 || res.status === 401) {
        if (safeJSON.success) return { success: false, message: safeJSON.data.message }
      }
    }

    // Handle successful user creation
    if (safeJSON.success && safeJSON.data.success) {
      // Store validated authObject
      storeAuth(safeJSON.data.authObject)
      return { success: true, data: 'User created successfully' }
    }

    // Return unsuccessful result as a fallback
    return { success: false, message: `HTTP Error: status ${res.status}` }
  } catch (error) {
    console.error(`Error:\n`, error)
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Validate and login a user
 * @param credentials Object containing user credentials
 * @returns `Result` indicating if login is successful
 */
export async function login(credentials: { email: string; password: string }): Promise<Result> {
  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    // Attempt to parse, validate response body
    const json = await res.json().catch(() => null)
    const safeJSON = AuthResponseSchema.safeParse(json)

    // Handle unsuccessful login attempt
    if (!res.ok) {
      if (res.status === 400 || res.status === 401) {
        if (safeJSON.success) return { success: false, message: safeJSON.data.message }
      }
    }

    // Handle successful login attempt
    if (safeJSON.success && safeJSON.data.success) {
      storeAuth(safeJSON.data.authObject)
      return { success: true, data: 'User logged in!' }
    }

    // Return unsuccessful result as a fallback
    return { success: false, message: `HTTP Error: Status ${res.status}` }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
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

export function getJWT() {
  const authStore = localStorage.getItem(authStoreKey)
  if (authStore) {
    const authObject = JSON.parse(authStore)
    const safeAuthObject = AuthObjectSchema.safeParse(authObject)
    console.log(safeAuthObject.success)
    if (!safeAuthObject.success) return null
    return safeAuthObject.data.accessToken
  }
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
