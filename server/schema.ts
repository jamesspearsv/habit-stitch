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
  id: integer().primaryKey(),
  name: text().notNull(), // task name
  description: text(), // explanation of habit
  color: text().notNull(), // color hex code string (#rrggbb)
  interval_days: integer().notNull(), // completion interval in number of days
  is_active: integer({ mode: 'boolean' }).default(false),
  created_at: text().default(sql`CURRENT_TIMESTAMP`), // ISO datetime in UTC
  user_id: integer().references(() => users.id),
})

export const logs = sqliteTable('logs', {
  id: integer().primaryKey(),
  timestamp: text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`), // ISO datetime of log entry in UTC
  notes: text(), // optional user notes
  habit_id: integer().references(() => habits.id), // related habit id
  user_id: integer().references(() => users.id), // related user id
  created_at: text().default(sql`CURRENT_TIMESTAMP`), // entry creation timestamp
})
