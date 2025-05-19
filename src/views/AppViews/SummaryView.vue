<script setup lang="ts">
import HeadingContainer from '@/components/HeadingContainer.vue'
import { fetchSummary } from '@/lib/actions'
import {
  calculateOpacity,
  calculatePosition,
  calculateRadius,
  getAngleFromSeed,
  stringToSeed,
} from '@/lib/helpers'
import type { SummaryMap } from '@/lib/types'
import { onMounted, ref, useTemplateRef, watch } from 'vue'
const summary = ref<SummaryMap[] | null>(null)
const canvas = useTemplateRef('canvas')
const canvasSize = { width: 500, height: 500 }

onMounted(async () => {
  const map = await fetchSummary()
  if (map.success) summary.value = map.data
})

watch(summary, () => {
  // Draw pattern on canvas
  if (!canvas.value || !summary.value) return
  const ctx = canvas.value.getContext('2d')
  if (ctx) {
    summary.value.forEach((habit) => {
      if (habit.activity_percent > 0) {
        const seed = stringToSeed(habit.habit_name)
        const angle = getAngleFromSeed(seed)
        const radius = calculateRadius(habit.activity_percent, 300, 50)
        const startAngle = 0
        const endAngle = 2 * Math.PI
        const { x, y } = calculatePosition(habit.activity_percent, angle, canvasSize)
        const opacity = calculateOpacity(habit.activity_percent, 0.75, 0.2)

        // console.log(
        //   `habit_name: ${habit.habit_name}\n%:${habit.activity_percent}\nseed: ${seed}\nangle: ${angle}\nradius: ${radius}\n{x, y}: {${x}, ${y}}\nopacity: ${opacity}`,
        // )

        ctx.fillStyle = `rgb(from ${habit.habit_color} r g b / ${opacity})`
        ctx.beginPath()
        ctx.arc(x, y, radius, startAngle, endAngle)
        ctx.fill()
        ctx.closePath()
      }
    })
  }
})
</script>

<template>
  <HeadingContainer>
    <h1>Today's Habit Pattern!</h1>
  </HeadingContainer>
  <section>
    <canvas ref="canvas" :height="canvasSize.height" :width="canvasSize.width"></canvas>
  </section>
</template>

<style scoped>
canvas {
  background-color: color-mix(in srgb, var(--c-text), #000000 3%);
  border: solid 5px var(--c-secondary);
  border-radius: var(--br-lg);
  margin: auto;
}
</style>
