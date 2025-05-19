<script setup lang="ts">
// TODO: Customizable pattern generation params

// TODO: Reactive date range selection (last week, two weeks ago, etc.)

// TODO: Summary mode (week more and month mode)

// TODO: Per habit summary details for the current period
import HeadingContainer from '@/components/HeadingContainer.vue'
import { fetchSummary } from '@/lib/actions'
import {
  calculateOpacity,
  calculatePosition,
  calculateRadius,
  getAngleFromSeed,
  newGetDateRange,
  stringToSeed,
} from '@/lib/helpers'
import type { SummaryMap } from '@/lib/types'
import { onMounted, ref, useTemplateRef, watch } from 'vue'
const summary = ref<SummaryMap[] | null>(null)
const canvas = useTemplateRef('canvas')
const canvasSize = { width: 500, height: 500 }
const week = newGetDateRange('week')

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
    <div class="heading-content">
      <h1>This week's pattern!</h1>
      <p>
        {{ new Date(week.start).toLocaleDateString() }} to
        {{ new Date(week.end).toLocaleDateString() }}
      </p>
    </div>
  </HeadingContainer>
  <section>
    <canvas ref="canvas" :height="canvasSize.height" :width="canvasSize.width"></canvas>
  </section>
  <section class="sub-content">
    <p>Check back here to see how your pattern grows this week</p>
  </section>
</template>

<style scoped>
.heading-content {
  text-align: center;
}

.sub-content {
  text-align: center;
  padding: var(--sp-sm);
}

canvas {
  background-color: color-mix(in srgb, var(--c-text), #000000 3%);
  border: solid 5px var(--c-secondary);
  border-radius: var(--br-lg);
  margin: auto;
}
</style>
