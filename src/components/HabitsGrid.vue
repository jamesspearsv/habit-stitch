<script lang="ts" setup>
import { deleteActivity, fetchHabits, logActivity } from '@/lib/actions'
import type { MappedHabit } from '@/lib/types'
import { onMounted, ref, watch } from 'vue'

const habits = ref<MappedHabit[] | null>(null)
const error = ref(false)
const props = defineProps<{ signal: number }>()

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

watch(
  () => props.signal,
  async () => await fetchData(),
)

// Fetch habits from backend
onMounted(async () => {
  await fetchData()
})

async function handleActivityLog(habit_id: string) {
  const result = await logActivity(habit_id)
  if (result.success) await fetchData()
}

async function handleActivityDelete(activity_id: string) {
  const result = await deleteActivity(activity_id)
  if (result.success) await fetchData()
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
      <!-- <p v-if="habit.completed_date">Completed on {{ habit.completed_date }}</p> -->
    </button>
  </div>
</template>

<style scoped>
button.habit {
  background-color: var(--c-bg-alt);
  padding: var(--sp-xxl) var(--sp-sm);
  border: solid var(--bs-0) color-mix(in srgb, var(--c-bg) 100%, #000 5%);
  border-radius: var(--br-md);
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block: var(--sp-md);
}

button.today {
  background-color: var(--c-accent);
  color: var(--c-text);
}
</style>
