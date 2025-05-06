<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import HabitCard from '@/components/HabitCard.vue'
import CreateHabitForm from '@/components/CreateHabitForm.vue'
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
  <CreateHabitForm @update="async () => await fetchData()">
    <h1>Today's Habits</h1>
  </CreateHabitForm>
  <div v-if="error">Error!</div>
  <section v-else>
    <HabitCard
      @update="async () => await fetchData()"
      v-for="habit in habits"
      :key="habit.id"
      :id="habit.id"
      :habit_name="habit.habit_name"
      :activity_id="habit.activity_id"
      :habit_color="habit.habit_color"
    />
  </section>
</template>

<style scoped>
.nav-section {
  padding: var(--sp-md);
  display: flex;
  justify-content: center;
}
</style>
