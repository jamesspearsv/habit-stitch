import { db } from './db'

export async function selectLogs(date: string) {
  const result = await db.logs.where('created_on').equals(date).toArray()
  return result
}

export async function deleteLog(id: string) {
  await db.logs.delete(id)
}
