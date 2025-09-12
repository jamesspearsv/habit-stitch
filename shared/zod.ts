import * as z from 'zod'
import { createSelectSchema } from 'drizzle-zod'
import { habits, logs } from '../server/schema'

//* Data Structure Schemas
export const HabitSchema = createSelectSchema(habits, {
  id: z.number(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  interval_days: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  user_id: z.number(),
})

export const LogSchema = createSelectSchema(logs, {
  id: z.number(),
  timestamp: z.string(),
  notes: z.string().nullable(),
  habit_id: z.number(),
  user_id: z.number(),
  created_at: z.string(),
})

// Incoming new user data from client
export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})

// Auth, JWT user data
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  created_at: z.string(),
})

// Client side auth data
export const AuthObjectSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
})

// JWT payload and server-side auth data
export const JWTPayloadSchema = z.object({
  exp: z.number(),
  iat: z.number(),
  user: UserSchema,
})

//* Response Schemas
export const AuthResponseSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true), message: z.string(), authObject: AuthObjectSchema }),
  z.object({ success: z.literal(false), message: z.string() }),
])

// function createPaginatedResponseSchema<ItemType extends z.ZodTypeAny>(
//   itemSchema: ItemType,
// ) {
//   return z.object({
//     pageIndex: z.number(),
//     pageSize: z.number(),
//     totalCount: z.number(),
//     totalPages: z.number(),
//     items: z.array(itemSchema),
//   });
// }
