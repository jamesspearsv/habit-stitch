<script setup lang="ts">
import { fetchActivities } from '@/lib/actions'
import { generateHexCode } from '@/lib/helpers'
import { onMounted, ref } from 'vue'
const activities = ref<{ habit_color: string }[]>([])
for (let i = 0; i < 75; i++) {
  console.log(generateHexCode())
  activities.value.push({ habit_color: generateHexCode() })
}

onMounted(async () => {
  await fetchActivities()
})
</script>
<template>
  <main>
    <h1>Habit Pattern!</h1>
    <section>
      <article
        v-for="activity in activities"
        :key="activity.habit_color"
        :style="{ backgroundColor: activity.habit_color }"
      />
    </section>
  </main>
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
