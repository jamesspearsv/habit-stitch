<script setup lang="ts">
import { fetchActivities } from '@/lib/actions'
import type { MappedActivity } from '@/lib/types'
import { onMounted, ref } from 'vue'
const activities = ref<MappedActivity[] | null>()

onMounted(async () => {
  const result = await fetchActivities()
  if (result.success) activities.value = result.data
})
</script>
<template>
  <h1>Habit Pattern!</h1>
  <section>
    <article
      v-for="activity in activities"
      :key="activity.id"
      :style="{ backgroundColor: activity.color }"
    />
  </section>
</template>
<style scoped>
section {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
}
article {
  width: 100%;
  aspect-ratio: 1/1;
}
</style>
