<script lang="ts" setup>
import { fetchHabits } from '@/lib/actions'
import type { MappedHabit } from '@/lib/types'
import { onMounted, ref, watch } from 'vue'
import HabitCard from './HabitCard.vue'

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
    />
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
