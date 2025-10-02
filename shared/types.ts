import * as z from 'zod'
import {
  type AuthObjectSchema,
  type AuthResponseSchema,
  type JWTPayloadSchema,
  type HabitSchema,
  UserSchema,
  LogSchema,
  SyncOperationSchema,
  SyncQueueSchema,
  SyncPushResponseSchema,
} from './zod'

//* Sync Layer Types
export type SyncOperation = z.infer<typeof SyncOperationSchema>
export type SyncQueue = z.infer<typeof SyncQueueSchema>

//* Database Types
export type User = z.infer<typeof UserSchema>
export type Habit = z.infer<typeof HabitSchema>
export type Log = z.infer<typeof LogSchema>
export type AuthObject = z.infer<typeof AuthObjectSchema>

//* Data Exchange Types
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type SyncPushResponse = z.infer<typeof SyncPushResponseSchema>

//* Utility Types
export type Result<T = string> = { success: true; data: T } | { success: false; message: string }

export type JWTPayload = z.infer<typeof JWTPayloadSchema>

//* Dexie Query Types
export type HabitQuery = Habit & { logs: Log[]; completed: boolean }
