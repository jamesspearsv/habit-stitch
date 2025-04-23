<script lang="ts" setup>
import { HabitChecks, Habits } from '@/assets/data'
import { ref } from 'vue'
const id = 1

const habits = ref(Habits)
const habitChecks = ref(HabitChecks)

function handleHabitClick(task_id: string) {
  console.log(id)
  habitChecks.value.push({
    id: id.toString(),
    task_id,
    date: new Date().toISOString(),
  })
}
</script>

<template>
  <ul class="habit-list">
    <li
      v-for="habit in habits"
      :key="habit.id"
      @click="() => handleHabitClick(habit.id)"
      class="habit"
    >
      <button>{{ habit.name }} ({{ habit.id }})</button>
    </li>
  </ul>
  <ul>
    <li v-for="check in habitChecks" :key="check.id">
      Completed: {{ check.task_id }} on {{ check.date }}
    </li>
  </ul>
</template>

<style scoped>
.habit-list {
  display: flex;
  flex-direction: column;
}

.habit {
  display: flex;
}

button {
  background-color: var(--color-accent);
  padding: var(--spacing-xxl) var(--spacing-sm);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: color-mix(in srgb, var(--color-accent) 100%, black 5%);
}
</style>
