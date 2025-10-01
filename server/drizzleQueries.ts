import { drizzle } from 'drizzle-orm/d1'
import { habits, logs, users } from './drizzleSchema'
import { and, DrizzleQueryError, eq } from 'drizzle-orm'
import { Result, SyncOperation } from '@shared/types'
import { reset, seed } from 'drizzle-seed'
import bcryptjs from 'bcryptjs'
import { HabitSchema, LogSchema } from '@shared/zod'

export async function resetAndSeedDB(binding: D1Database) {
  const db = drizzle(binding)
  console.log('resetting database tables...')
  await reset(db, { habits, users })

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
        user_id: f.valuesFromArray({ values: [1] }),
        created_at: f.datetime(),
        interval_days: f.valuesFromArray({ values: [1, 2, 7, 30] }),
        description: f.loremIpsum(),
        name: f.jobTitle(),
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

export async function insertLog(
  user_id: number,
  habit_id: number,
  binding: D1Database,
): Promise<Result> {
  try {
    const db = drizzle(binding)
    await db.insert(logs).values({ user_id, habit_id })
    return { success: true, data: 'New log inserted' }
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

export async function selectHabits(
  userID: number,
  binding: D1Database,
  options?: {
    habitID?: number
  },
): Promise<Result<(typeof habits.$inferSelect)[]>> {
  try {
    const db = drizzle(binding)

    const data = await db
      .select()
      .from(habits)
      .where(
        and(
          eq(habits.user_id, userID),
          options?.habitID ? eq(habits.id, options.habitID) : undefined,
        ),
      )

    return { success: true, data: data }
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      console.error(error.message)
      return { success: false, message: 'Database error' }
    }

    throw error
  }
}

export async function handleSyncOperation(operation: SyncOperation, binding: D1Database) {
  /* 
  1. Parse which table is being modified
  2. See what type of operation is being done
  3. Validate the operation payload
  4. Apply the operations
  */

  const db = drizzle(binding)
  const { action, table, payload } = operation
  const dbTable = operation.table === 'habits' ? habits : logs

  if (action === 'create' || action === 'update') {
    const safePayload =
      table === 'habits' ? await HabitSchema.safeParse(payload) : await LogSchema.safeParse(payload)

    if (!safePayload.success) return

    await db
      .insert(dbTable)
      .values(safePayload.data)
      .onConflictDoUpdate({ target: dbTable.id, set: safePayload.data })
  }

  // TODO: handle upserts

  // TODO: handle deletions
}
