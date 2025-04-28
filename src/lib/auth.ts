import { pb } from '@/lib/pb'
import type { Result } from '@/lib/types'

export async function signin(user: { email: string; password: string }): Promise<Result> {
  try {
    await pb.collection('users').authWithPassword(user.email, user.password)
    return { success: true, data: 'signed in successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, error: 'Invalid username or password' }
  }
}

export async function signout() {
  pb.authStore.clear()
}
