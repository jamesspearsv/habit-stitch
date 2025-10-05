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
  id: z.string(),
  name: z.string(),
  description: z.nullable(z.string()),
  color: z.string(),
  is_active: z.boolean(),
  created_on: z.string(), // ISO formatted calendar date
  user_id: z.number(),
  last_modified: z.int().positive().nullable(),
})

export const LogSchema = z.object({
  id: z.string(),
  habit_id: z.string(),
  user_id: z.number(),
  created_on: z.string(), // ISO formatted calendar date
  last_modified: z.int().positive().nullable(),
})

// Auth, JWT user data
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  created_at: z.string(),
})

//* Authentication schemas
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

//* Sync layer schemes
export const SyncOperationSchema = z.object({
  id: z.uuid(),
  timestamp: z.number(),
  status: z.boolean(),
  action: z.union([z.literal('create'), z.literal('delete'), z.literal('update')]),
  table: z.union([z.literal('habits'), z.literal('logs')]),
  payload_id: z.string(),
  payload: z.union([HabitSchema, LogSchema, z.uuid()]),
})

export const SyncQueueSchema = z.array(SyncOperationSchema)

//* Response Schemas
export const AuthResponseSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true), message: z.string(), authObject: AuthObjectSchema }),
  z.object({ success: z.literal(false), message: z.string() }),
])

export const SyncPushResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    message: z.string(),
    successful_operations: z.array(z.uuid()),
    failed_operations: z.array(z.uuid()),
  }),
  z.object({ success: z.literal(false), message: z.string() }),
])

export const SyncPullResponseSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    message: z.string(),
    habits: z.array(HabitSchema),
    logs: z.array(LogSchema),
  }),
  z.object({ success: z.literal(false), message: z.string() }),
])

// function ResponseSchema<DataSchema extends z.ZodType>(dataSchema: DataSchema) {
//   return z.discriminatedUnion('success', [
//     z.object({ success: z.literal(true), data: dataSchema }),
//     z.object({ success: z.literal(false), message: z.string() }),
//   ])
// }
