import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/*
 * *************************************************************************
 * Drizzle Resources
 * https://orm.drizzle.team/docs/column-types/sqlite#customizing-data-type
 * https://orm.drizzle.team/docs/relations
 * *************************************************************************
 */

export const users = sqliteTable('users', {
  id: integer().primaryKey(),
  name: text().notNull(),
  hashed_password: text().notNull(),
  email: text().notNull(),
  created_at: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // ISO datetime in UTC
})

export const habits = sqliteTable('habits', {
  id: text().primaryKey().notNull().default(crypto.randomUUID()),
  name: text().notNull(), // task name
  description: text(), // explanation of habit
  color: text().notNull(), // color hex code string (#rrggbb)
  interval_days: integer().notNull(), // completion interval in number of days
  is_active: integer({ mode: 'boolean' }).notNull().default(false),
  created_on: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // ISO datetime in UTC
  last_modified: integer(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const logs = sqliteTable('logs', {
  id: text().primaryKey().notNull().default(crypto.randomUUID()),
  timestamp: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // ISO datetime of log entry in UTC
  notes: text(), // optional user notes
  habit_id: integer()
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }), // related habit id
  created_on: text().default(sql`CURRENT_TIMESTAMP`), // entry creation timestamp
  last_modified: integer(),
  user_id: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // related user id
})
