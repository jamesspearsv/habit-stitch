import { defineConfig } from 'drizzle-kit'

/*
 * Drizzle workflow
 * 1. Define drizzle schemas in schema.ts
 * 2. Use drizzle-kit to generate migration files
 * 3. Use wrangler to apply migration to local dev resources
 * 4. Test migrations and database
 * 5. Use wrangler to apply migration to production resources
 */

// TODO: Add dynamic config script to handle local development.

function findLocalD1Database() {}

// if env === dev use local sqlite database
// else use remote D1 instance

export default defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  schema: './server/schema.ts',
  dbCredentials: {
    accountId: process.env.CF_ACCOUNT_ID!,
    databaseId: process.env.CF_DATABASE_ID!,
    token: process.env.CF_D1_TOKEN!,
  },
})
