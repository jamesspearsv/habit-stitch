import { defineConfig } from 'drizzle-kit'
import path from 'path'
import fs from 'fs'

/*
 * Drizzle workflow
 * 1. Define drizzle schemas in schema.ts
 * 2. Use wrangler to create local Miniflare D1
 * 3. Use drizzle-kit to push schema changes to local D1
 * 4. Test changes and database
 * 5. Use drizzle-kit to generate migration files
 * 6. Use wrangler to apply migration to production resources
 */

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

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/schema.ts',
  dbCredentials: {
    url: findLocalD1DB()!,
  },
})
