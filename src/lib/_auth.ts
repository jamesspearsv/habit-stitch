import type { Result } from '@client/lib/types'

export async function signin(user: { email: string; password: string }): Promise<Result> {
  console.log(user)
  // try {
  //   await pb.collection('users').authWithPassword(user.email, user.password)
  //   return { success: true, data: 'signed in successfully' }
  // } catch (error) {
  //   if (error instanceof ClientResponseError) {
  //     console.error(`${error.status}: ${error.message}`)
  //   }
  // }
  return { success: false, error: 'Invalid username or password' }
}

export async function signout() {
  // pb.authStore.clear()
  return
}

export async function createUser(user: {
  name: string
  email: string
  password: string
}): Promise<Result> {
  console.log(user)
  // try {
  //   await pb.collection('users').create({
  //     name: user.name,
  //     email: user.email,
  //     password: user.password,
  //     passwordConfirm: user.password,
  //   })
  //   return { success: true, data: 'Created new user' }
  // } catch (error) {
  //   if (error instanceof ClientResponseError) {
  //     console.error(`${error.status}: ${error.message}`)
  //   }
  // }
  return { success: false, error: 'Unable to create user' }
}
