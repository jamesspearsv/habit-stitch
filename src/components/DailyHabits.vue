<script lang="ts" setup>
import { deleteActivity, fetchHabits, logActivity } from '@/lib/actions'
import type { MappedHabit } from '@/lib/types'
import { onMounted, ref, watch } from 'vue'

const habits = ref<MappedHabit[] | null>(null)
const error = ref(false)
const refresh = ref(Math.random())

async function fetchData() {
  const result = await fetchHabits()
  if (result.success) {
    habits.value = result.data
    error.value = false
  } else {
    habits.value = null
    error.value = true
  }
}

// Fetch habits from backend
onMounted(async () => {
  await fetchData()
})

watch(refresh, fetchData)

async function handleActivityLog(habit_id: string) {
  const result = await logActivity(habit_id)
  if (result.success) refresh.value = Math.random()
}

async function handleActivityDelete(activity_id: string) {
  console.log('delete')
  const result = await deleteActivity(activity_id)
  if (result.success) refresh.value = Math.random()
}
</script>

<template>
  <div v-if="error">Error!</div>
  <div v-else-if="!habits">Loading....</div>
  <div v-else>
    <button
      v-for="habit in habits"
      :key="habit.id"
      :class="{ habit: true, today: habit.completed_date }"
      @click="
        () => {
          if (habit.completed_date) handleActivityDelete(habit.activity_id)
          if (!habit.completed_date) handleActivityLog(habit.id)
        }
      "
    >
      {{ habit.habit_name }}
      <p v-if="habit.completed_date">Completed on {{ habit.completed_date }}</p>
    </button>
  </div>
</template>

<style scoped>
button.habit {
  background-color: color-mix(in srgb, var(--color-background) 100%, #fff 5%);
  padding: var(--spacing-xxl) var(--spacing-sm);
  border: solid var(--border-size) color-mix(in srgb, var(--color-background) 100%, #000 5%);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block: var(--spacing-md);
}

button.today {
  background-color: var(--color-accent);
  color: var(--color-text);
}
</style>
