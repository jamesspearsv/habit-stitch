import * as z from 'zod'
import type { AuthObjectSchema, CreateUserResponseSchema } from './zod'

export type AuthObject = z.infer<typeof AuthObjectSchema>
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>

export type Result<T = string> = { success: true; data: T } | { success: false; error: string }
