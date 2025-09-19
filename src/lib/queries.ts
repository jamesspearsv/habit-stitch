import { db } from '@client/db'

// TODO: finish this query function
export async function getHabits() {
  const habits = await db.habits.orderBy('name').toArray()
  const log = await db.log.toArray()

  const mappedHabits = habits.map((habit) => {
    const filteredLog = log.filter((log) => {
      const hidMatch = log.habit_id === habit.id
      const dateMatch =  
    })

    return { ...habit, completedStatus: filteredLog.length > 0 }
  })

  return mappedHabits
}
