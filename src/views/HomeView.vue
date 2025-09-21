<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import { type Log, type Habit } from '@shared/types'
import HabitList from '@client/components/HabitList.vue'
import { liveQuery, type Subscription } from 'dexie'
import { db } from '@client/db'
import { isDateToday } from '@client/lib/helpers'

const habitSub = ref<Subscription | null>(null)
const logSub = ref<Subscription | null>(null)
const error = ref('')

const habits = ref<Habit[]>([])
const logs = ref<Log[]>([])
// Verify the completion status of each habit
const dailyHabits = computed(() => {
  // TODO: Improve log filtering and mapping
  const dailyHabits = habits.value.map((habit) => {
    const filteredLogs = logs.value.filter((log) => log.habit_id === habit.id)
    if (filteredLogs.length > 0) return { ...habit, completed: true }
    return { ...habit, completed: false }
  })

  return dailyHabits
})

// Init live query and subscribe
// to data changes from DB
onMounted(async () => {
  console.log('Subscribing to query...')
  const habitQuery = liveQuery(() => db.habits.orderBy('name').toArray())
  const logQuery = liveQuery(() =>
    db.log.filter((log) => isDateToday(new Date(log.timestamp))).toArray(),
  )

  habitSub.value = habitQuery.subscribe({
    next: (result) => {
      habits.value = result
      error.value = ''
    },
    error: () => {
      habits.value = []
      error.value = 'Unable to find habits'
    },
  })

  logSub.value = logQuery.subscribe({
    next: (result) => {
      logs.value = result
      error.value = ''
    },
    error: () => {
      logs.value = []
      error.value = 'Unable to find log'
    },
  })
})

// Close DB subscription when
// component is unmounted
onUnmounted(() => {
  console.log('Unsubscribing from query...')
  habitSub.value?.unsubscribe()
  logSub.value?.unsubscribe()
})
</script>

<template>
  <div>
    <h1>Habit<span>Stitch</span></h1>
  </div>
  <CreateHabitForm />
  <div v-if="error">{{ error }}</div>
  <section v-if="habits && !error">
    <HabitList :habits="dailyHabits" />
    <br />
    <div v-for="log in logs" :key="log.id">
      <p>{{ log.id }} | {{ log.timestamp }}</p>
      <br />
    </div>
  </section>
</template>

<style scoped>
h1 {
  font-size: var(--fs-4);
  font-weight: bold;
}
h1 > span {
  background: linear-gradient(90deg, #17898f 0%, #f6c44b 50%, #b72a3a 100%);
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  width: max-content;
}

.nav-section {
  padding: var(--sp-md);
  display: flex;
  justify-content: center;
}
</style>
