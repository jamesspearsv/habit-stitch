import { defineConfig } from 'drizzle-kit'
import path from 'path'
import fs from 'fs'

/*
 * Drizzle workflow
 * 1. Define drizzle schemas in schema.ts
 * 2. Use drizzle-kit to generate migration files
 * 3. Use wrangler to apply migration to local dev resources
 * 4. Test migrations and database
 * 5. Use wrangler to apply migration to production resources
 */

// TODO: Add dynamic config script to handle local development.

function findLocalD1DB() {
  try {
    const basePath = path.resolve('.wrangler')
    const dbFile = fs
      .readdirSync(basePath, { encoding: 'utf-8', recursive: true })
      .find((f) => f.endsWith('.sqlite'))

    if (!dbFile) {
      throw new Error(`.sqlite file not found in ${basePath}`)
    }

    console.log(basePath + dbFile)
    return path.resolve(basePath, dbFile)
  } catch (error) {
    if (error instanceof Error) console.log(`Error: ${error.message}`)
  }
}

// if env === dev use local sqlite database
// else use remote D1 instance

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/schema.ts',

  ...(process.env.NODE_ENV === 'prod'
    ? {
        driver: 'd1-http',
        dbCredentials: {
          accountId: process.env.CF_ACCOUNT_ID!,
          databaseId: process.env.CF_DATABASE_ID!,
          token: process.env.CF_D1_TOKEN!,
        },
      }
    : {
        dbCredentials: {
          url: findLocalD1DB()!,
        },
      }),
})
