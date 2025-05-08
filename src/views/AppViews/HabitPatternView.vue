<script setup lang="ts">
import { fetchActivities } from '@/lib/actions'
import type { MappedActivity } from '@/lib/types'
import { computed, onMounted, ref } from 'vue'
const activities = ref<MappedActivity[] | null>()
const colors = ref<{ [key: string]: string[] }>({})
const clr = computed(() => {
  const c = { ...colors.value }
  Object.keys(c).forEach((key) => {
    const length = c[key].length
    // TODO: compute average colors from array of hex codes
    c[key] = ['string']
  })
  return c
})

onMounted(async () => {
  const result = await fetchActivities()
  if (result.success) {
    activities.value = result.data
    activities.value.forEach((activity) => {
      const date = new Date(activity.date).toLocaleString().split(',')[0]
      if (!colors.value[date]) {
        colors.value = { ...colors.value, [date]: [activity.color.slice(1)] }
      } else {
        colors.value = { ...colors.value, [date]: [...colors.value[date], activity.color.slice(1)] }
      }
    })
    console.log(result.data)
  }
})
console.log(colors)
</script>
<template>
  <div>{{}}</div>
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
