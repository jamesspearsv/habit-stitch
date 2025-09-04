import * as z from 'zod'

export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})

export const AuthObjectSchema = z.object({
  access_token: z.string(),
  user_name: z.string(),
  user_email: z.email(),
  iat: z.number(),
})
