import * as z from 'zod'

export const NewUser = z.object({
  name: z.string(),
  password: z.string(),
  email: z.email(),
})
