<script setup lang="ts">
import { fetchActivities } from '@/lib/actions'
import type { MappedActivity } from '@/lib/types'
// import type { MappedActivity } from '@/lib/types'
import { onMounted, ref } from 'vue'
const activities = ref<MappedActivity[] | null>(null)

onMounted(async () => {
  const result = await fetchActivities()
  if (result.success) {
    activities.value = result.data
  }
})
</script>

<template>
  <h1>Habit Pattern!</h1>
  <section>
    <h2>This section is a work in progress...</h2>
    <!-- <div
      class="hexagon"
      v-for="activity in activities"
      :key="activity.id"
      :style="{ backgroundColor: activity.color }"
    /> -->
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-grow: wrap;
  gap: var(--sp-xs);
}

.hexagon {
  height: 64px;
  width: 75px;
  clip-path: polygon(0 50%, 25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%);
}
</style>
