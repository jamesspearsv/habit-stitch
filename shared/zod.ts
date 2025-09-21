import * as z from 'zod'

//* Data Structure Schemas
// Incoming new user data from client
export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})

// Database table schemas
export const HabitSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.nullable(z.string()),
  color: z.string(),
  interval_days: z.number(),
  is_active: z.boolean(),
  created_on: z.string(), // ISO formatted calendar date
  user_id: z.number(),
})

export const LogSchema = z.object({
  id: z.uuid(),
  notes: z.string(),
  habit_id: z.uuid(),
  user_id: z.number(),
  created_on: z.string(), // ISO formatted calendar date
})

// Auth, JWT user data
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  created_at: z.string(),
})

// authentication schemas
// Client side auth data
export const AuthObjectSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
})

// JWT payload and server-side auth data
export const JWTPayloadSchema = z.object({
  // exp: z.number(),
  // iat: z.number(),
  user: UserSchema,
})

//* Response Schemas
export const AuthResponseSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true), message: z.string(), authObject: AuthObjectSchema }),
  z.object({ success: z.literal(false), message: z.string() }),
])

function ResponseSchema<DataSchema extends z.ZodType>(dataSchema: DataSchema) {
  return z.discriminatedUnion('success', [
    z.object({ success: z.literal(true), data: dataSchema }),
    z.object({ success: z.literal(false), message: z.string() }),
  ])
}

export const HabitsResponseSchema = ResponseSchema(z.array(HabitSchema))
export const LogResponseSchema = ResponseSchema(z.string())
