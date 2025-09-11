import * as z from 'zod'

/*
 * Data Struct Schemas
 */
export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  created_at: z.string(),
})

export const AuthObjectSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
})

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
