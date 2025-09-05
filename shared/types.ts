import * as z from 'zod'
import type { AuthObjectSchema, AuthResponseSchema } from './zod'

export type AuthObject = z.infer<typeof AuthObjectSchema>
export type AuthRouteResponse = z.infer<typeof AuthResponseSchema>

export type Result<T = string> = { success: true; data: T } | { success: false; error: string }
