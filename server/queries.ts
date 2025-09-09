import { drizzle } from 'drizzle-orm/d1'
import { habits, users } from './schema'
import { DrizzleQueryError, eq } from 'drizzle-orm'
import { Result } from '@shared/types'
import { reset, seed } from 'drizzle-seed'
import bcryptjs from 'bcryptjs'
import { generateHexCode } from '../src/lib/helpers'

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
          defaultValue: generateHexCode(),
        }),
      },
    },
  }))
}

export async function insertUser(
  user: {
    name: string
    hashed_password: string
    email: string
  },
  binding: D1Database,
): Promise<Result> {
  try {
    // init db connection & insert new user
    const db = drizzle(binding)
    await db.insert(users).values(user)
    return { success: true, data: 'New user created!' }
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
      // todo: consider throwing a normalized error vs using Result type
      return { success: false, message: 'Database error' }
    }

    throw error
  }
}

/*
Guidelines for error handling around DB operations (keep minimal refactor)

Catch where you can meaningfully handle:
Put try/catch at the caller (route) when you need to map errors to HTTP responses, add request-specific logging/context, retry, or do compensating actions.
Put try/catch inside the DB/service function when you can normalize low-level DB driver errors into a small set of domain errors (ConflictError, TransientError, ValidationError). This keeps callers simpler and DRYs DB-driver logic.
Recommended hybrid pattern:
Service layer: normalize DB errors into named Error subclasses (or return Result types).
Example: convert unique-constraint errors → ConflictError; connection timeouts → TransientError.
Re-throw unknown errors unchanged so global handler can catch them.
Caller / route: catch domain errors and map them to appropriate HTTP statuses (409, 400, 503).
Add request-specific logging/context here.
Rethrow unknown errors to let global onError handle logging + 500 response.
Global onError: centralized logging and a generic 500 response for unexpected exceptions.
Practical rules:
Use try/catch around the smallest block needed (usually the single DB call).
Prefer normalized domain errors from service layer rather than string-matching DB messages at every caller.
Return proper HTTP status codes for client vs server errors; the response body "success" flag is secondary.
Log full error details (stack/cause) server-side; return generic messages to clients.
Minimal example flow:
insertUser() catches DB driver errors → throws ConflictError / TransientError / rethrows unexpected.
route calls insertUser() inside try/catch → maps ConflictError → 409, TransientError → 503, else rethrow.
app.onError logs stack and returns 500.
Keep this pattern to get clear HTTP semantics, concise routes, consistent logging, and minimal required refactor.
*/
