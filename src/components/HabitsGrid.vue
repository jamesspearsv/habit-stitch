<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import HabitCard from './HabitCard.vue'
import { fetchHabits } from '@/lib/actions'
import type { MappedHabit } from '@/lib/types'

const habits = ref<MappedHabit[] | null>(null)
const error = ref(false)

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
</script>

<template>
  <div v-if="error">Error!</div>
  <div v-else>
    <HabitCard
      @stale-data="
        async () => {
          await fetchData()
        }
      "
      v-for="habit in habits"
      :key="habit.id"
      :id="habit.id"
      :habit_name="habit.habit_name"
      :activity_id="habit.activity_id"
      :habit_color="habit.habit_color"
    />
  </div>
</template>
