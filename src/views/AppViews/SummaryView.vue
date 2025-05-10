<script setup lang="ts">
import { fetchActivities } from '@/lib/actions'
import type { MappedActivity } from '@/lib/types'
// import type { MappedActivity } from '@/lib/types'
import { onMounted, ref, useTemplateRef, watch } from 'vue'
const activities = ref<MappedActivity[] | null>(null)
const canvas = useTemplateRef('canvas')
const canvasDimensions = { x: 500, y: 500 }
const inDevelopment = import.meta.env.DEV

onMounted(async () => {
  const result = await fetchActivities()
  if (result.success) {
    activities.value = result.data
  }
})

watch(activities, () => {
  // Draw pattern on canvas
  if (!canvas.value || !activities.value) return
  const ctx = canvas.value.getContext('2d')
  if (ctx) {
    /*
    IDEAS:
    - Increase the radius of each circle in proportion to the % that each habit is of the total activities
    - Adjust the position of each circle based on the number of activities completed 
    */
    activities.value.forEach((activity) => {
      let x = Math.ceil(Math.random() * canvasDimensions.x)
      let y = Math.ceil(Math.random() * canvasDimensions.y)
      const radius = 75
      const safeArea = 100
      const startAngle = 0
      const endAngle = (Math.PI / 180) * 360

      // Check that position is inside safe zone
      if (x < safeArea) x = safeArea
      if (x > canvasDimensions.x - safeArea) x = canvasDimensions.x - safeArea
      if (y < safeArea) y = safeArea
      if (y > canvasDimensions.y - safeArea) y = canvasDimensions.y - safeArea

      ctx.fillStyle = `rgb(from ${activity.color} r g b / 0.5)`
      ctx.beginPath()
      ctx.arc(x, y, radius, startAngle, endAngle)
      ctx.fill()
      ctx.closePath()
    })
  }
})
</script>

<template>
  <h1>Habit Pattern!</h1>
  <section v-if="!inDevelopment">
    <h2>This section is a work in progress...</h2>
    <!-- <div
      class="hexagon"
      v-for="activity in activities"
      :key="activity.id"
      :style="{ backgroundColor: activity.color }"
    /> -->
  </section>
  <section v-if="inDevelopment">
    <canvas ref="canvas" :height="canvasDimensions.y" :width="canvasDimensions.x"></canvas>
  </section>
</template>

<style scoped>
/* section {
  display: flex;
  flex-grow: wrap;
  gap: var(--sp-xs);
}

.hexagon {
  height: 64px;
  width: 75px;
  clip-path: polygon(0 50%, 25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%);
} */

canvas {
  background-color: var(--c-text);
  border-radius: var(--br-lg);
}
</style>
