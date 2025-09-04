import * as z from 'zod'
import type { AuthObjectSchema } from './zod'

export type AuthObject = z.infer<typeof AuthObjectSchema>

export type Result<T = string> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }
