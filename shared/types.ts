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
  SyncPullResponseSchema,
} from './zodSchemas'
import Dexie, { type EntityTable } from 'dexie'

//* Sync Layer Types
export type SyncOperation = z.infer<typeof SyncOperationSchema>
export type SyncQueue = z.infer<typeof SyncQueueSchema>

//* Database Types
export type User = z.infer<typeof UserSchema>
export type Habit = z.infer<typeof HabitSchema>
export type Log = z.infer<typeof LogSchema>
export type AuthObject = z.infer<typeof AuthObjectSchema>

//* Request & Response Types
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type SyncPushResponse = z.infer<typeof SyncPushResponseSchema>
export type SyncPullResponse = z.infer<typeof SyncPullResponseSchema>

//* Utility Types
export type Result<T = string> = { success: true; data: T } | { success: false; message: string }

export type JWTPayload = z.infer<typeof JWTPayloadSchema>

//* Dexie Schema
export type DexieDatabase = Dexie & {
  habits: EntityTable<Habit, 'id'>
  logs: EntityTable<Log, 'id'>
  syncQueue: EntityTable<SyncOperation, 'id'>
}
