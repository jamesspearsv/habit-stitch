import * as z from 'zod'

/*
 * Data Struct Schemas
 */
// Incoming new user data from client
export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})

// Auth, JWT user data
const UserSchema = z.object({
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

/*
 * CF Worker Response Schemas
 */
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
