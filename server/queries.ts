import { drizzle } from 'drizzle-orm/d1'
import { users } from './schema'

export async function insertUser(
  user: {
    name: string
    hashed_password: string
    email: string
  },
  binding: D1Database,
) {
  try {
    // init db connection & insert new user
    const db = drizzle(binding)
    await db.insert(users).values(user)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    }
  }
}
