<script setup lang="ts">
import { fetchActivities } from '@/lib/actions'
import type { MappedActivity } from '@/lib/types'
// import type { MappedActivity } from '@/lib/types'
import { onMounted, ref } from 'vue'
const data = ref<{ activities: MappedActivity[]; pattern: string; extendedPattern: string } | null>(
  null,
)

onMounted(async () => {
  const result = await fetchActivities()
  if (result.success) {
    data.value = result.data
  }
})
</script>

<template>
  <h1>Habit Pattern!</h1>
  <section>
    <article
      v-for="activity in data?.activities"
      :key="activity.id"
      :style="{ backgroundColor: activity.color }"
    />
  </section>
  <div class="gradient" :style="{ backgroundImage: data?.pattern }"></div>
  <div class="gradient" :style="{ backgroundImage: data?.extendedPattern }"></div>
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
.gradient {
  width: 100%;
  height: 30vh;
}
</style>
