<script setup lang="ts">
import type { Habit } from '@shared/types'
import FeatherIcon from './FeatherIcon.vue'

defineProps<{
  habits: Habit[]
}>()
</script>

<template>
  <article v-for="habit in habits" :key="habit.id">
    <input type="checkbox" name="completionStatus" id="completionStatus" />
    <p>{{ habit.name }}</p>
    <button>
      <FeatherIcon icon="settings" :size="14" />
    </button>
  </article>
</template>

<style scoped>
article {
  display: flex;
  gap: 0.5rem;
  /* justify-content: space-between; */
  align-items: center;
  margin-bottom: 0.5rem;
}

p {
  flex: 2;
}
</style>
