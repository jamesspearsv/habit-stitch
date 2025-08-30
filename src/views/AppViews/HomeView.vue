<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import HabitCard from '@/components/HabitCard.vue'
import CreateHabitForm from '@/components/CreateHabitForm.vue'
import type { MappedHabit } from '@/lib/types'

const habits = ref<MappedHabit[] | null>(null)
const error = ref(false)

async function fetchData() {
  // const result = await fetchHabits()
  // if (result.success) {
  //   habits.value = result.data
  //   error.value = false
  // } else {
  // }
  habits.value = null
  error.value = true
}

// Fetch habits from backend
onMounted(async () => {})
</script>

<template>
  <CreateHabitForm @update="async () => await fetchData()">
    <div>
      <h1>Habit<span>Stitch</span></h1>
    </div>
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
