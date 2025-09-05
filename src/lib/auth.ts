import type { AuthObject, Result } from '@shared/types'
import { CreateUserResponseSchema } from '@shared/zod'

const authStoreKey = 'habitstitch_auth'

/**
 * Store authObject in local storage
 * @param authObject
 * @returns `void`
 */
export function storeAuth(authObject: AuthObject) {
  localStorage.setItem(authStoreKey, JSON.stringify(authObject))
}

/**
 * Validate user data to create a new user record
 * @param user Submitted new user data
 * @returns `boolean` value if user creation if successful or not
 */
export async function createUser(user: { name: string; email: string; password: string }) {
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
  const parsedResponse = CreateUserResponseSchema.safeParse(json)

  // Check validation & request success
  if (!parsedResponse.success) return false
  if (!parsedResponse.data.success) return false

  // Store validated authObject
  storeAuth(parsedResponse.data.authObject)

  return true
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
