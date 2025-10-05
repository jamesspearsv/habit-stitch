import { drizzle } from 'drizzle-orm/d1'
import { habits, users } from '../drizzleSchema'
import { DrizzleQueryError, eq } from 'drizzle-orm'
import { Result } from '@shared/types'
import { reset, seed } from 'drizzle-seed'
import bcryptjs from 'bcryptjs'

export async function resetAndSeedDB(binding: D1Database) {
  const db = drizzle(binding)
  console.log('resetting database tables...')
  await reset(db, { users })

  console.log('seeding users table...')
  await seed(db, { users }).refine((f) => ({
    users: {
      count: 1,
      columns: {
        hashed_password: f.default({ defaultValue: bcryptjs.hashSync('password12', 10) }),
        email: f.default({ defaultValue: 'demo1@demo.com' }),
        created_at: f.datetime(),
      },
    },
  }))

  console.log('seeding habits table...')
  await seed(db, { habits }).refine((f) => ({
    habits: {
      count: 10,
      columns: {
        id: f.uuid(),
        user_id: f.valuesFromArray({ values: [1] }),
        created_on: f.date(),
        last_modified: f.default({ defaultValue: Date.now() }),
        description: f.loremIpsum(),
        name: f.valuesFromArray({
          values: [
            'learn dexie',
            'read a book',
            'go to the gym',
            'take a walk',
            'practice another skill',
          ],
        }),
        color: f.default({
          defaultValue: '#123456',
        }),
      },
    },
  }))
}

export async function insertUser(
  user: typeof users.$inferInsert,
  binding: D1Database,
): Promise<Result<typeof users.$inferSelect>> {
  try {
    // init db connection & insert new user
    const db = drizzle(binding)
    const newUser = await db.insert(users).values(user).returning()
    return { success: true, data: newUser[0] }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      return { success: false, message: 'Database error' }
    }

    throw error
  }
}

export async function selectUser(
  email: string,
  binding: D1Database,
): Promise<Result<typeof users.$inferSelect>> {
  try {
    const db = drizzle(binding)
    const user = await db.select().from(users).where(eq(users.email, email))

    if (user.length < 1) return { success: false, message: 'No user found' }
    else return { success: true, data: user[0] }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      return { success: false, message: 'Database error' }
    }

    throw error
  }
}
