import * as z from 'zod'
import {
  type AuthObjectSchema,
  type AuthResponseSchema,
  type JWTPayloadSchema,
  type HabitSchema,
  UserSchema,
  LogSchema,
  HabitsResponseSchema,
  LogResponseSchema,
} from './zod'

export type SyncQueue = {
  id: string
  timestamp: number
  status: boolean
  action: 'create' | 'delete' | 'update'
  table: 'habits' | 'logs'
  payload_id: string
  payload: Habit | Log | string
}

//* Database Types
export type User = z.infer<typeof UserSchema>
export type Habit = z.infer<typeof HabitSchema>
export type Log = z.infer<typeof LogSchema>
export type AuthObject = z.infer<typeof AuthObjectSchema>

//* Data Exchange Types
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type HabitsResponse = z.infer<typeof HabitsResponseSchema>
export type LogResponse = z.infer<typeof LogResponseSchema>

export type Result<T = string> = { success: true; data: T } | { success: false; message: string }

export type JWTPayload = z.infer<typeof JWTPayloadSchema>

//* Dexie Query Types
export type HabitQuery = Habit & { logs: Log[]; completed: boolean }
