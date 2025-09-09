import * as z from 'zod'

/*
 * Data Struct Schemas
 */
export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})

export const AuthObjectSchema = z.object({
  accessToken: z.string(),
  userName: z.string(),
  userEmail: z.email(),
  issuedAt: z.number(), // unix timestamp in seconds
  userID: z.number()
})

/*
 * CF Worker Response Schemas
 */
export const AuthResponseSchema = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true), message: z.string(), authObject: AuthObjectSchema }),
  z.object({ success: z.literal(false), message: z.string() }),
])
