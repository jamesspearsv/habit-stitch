import type { AuthObject, Result } from '@shared/types'

const authStoreKey = 'habitstitch_auth'

/**
 * Store authObject in local storage
 * @param authObject
 * @returns Result
 */
export function storeAuth(authObject: AuthObject): Result {
  localStorage.setItem(authStoreKey, JSON.stringify(authObject))
  return { success: true, data: 'hs_authStore' }
}

/**
 * Checks the authStore value
 * @returns null | authObject
 */
export function isLoggedIn() {
  return localStorage.getItem(authStoreKey)
}
