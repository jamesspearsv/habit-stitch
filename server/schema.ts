// write schemas here...
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const habits = sqliteTable('habits', {
  id: integer().primaryKey(),
  name: text().notNull(),
  completion_goal: integer().notNull(),
})
