<script setup lang="ts">
import { ref } from 'vue'

const DEV = import.meta.env.DEV
const seedStatus = ref('Reset & Seed')

async function handleSeed() {
  const res = await fetch('/seed')

  if (res.ok) seedStatus.value = 'Database seeded!'
  else seedStatus.value = 'Error...'
}
</script>

<template>
  <main>
    <section class="hero-section">
      <button v-if="DEV" @click="handleSeed">{{ seedStatus }}</button>
      <h1>Habit Stitch is a habit building app for people who hate routines!</h1>
      <RouterLink class="cta-btn" :to="{ name: 'Signup' }">Sign Up</RouterLink>
      <p>Already have an account? <RouterLink :to="{ name: 'Login' }">Login</RouterLink></p>
    </section>
    <section class="info-section">
      <h2>What is Habit Stitch?</h2>
      <p>
        Habit Stitch is a habit tracker and routine builder for people who struggle with routines.
        Use Habit Stitch to stay on top of the habits you want to build or those fun activities you
        never seem to make time for! Build stronger routines and healthier habits by stitching
        together daily (or not daily) activities into larger habit patterns!
      </p>
      <h2>How does Habit Stitch work?</h2>
      <p>
        Add your habits and routines into Habit Stitch and check them off throughout the day. Each
        time you log an activity you'll add another stitch to your habit pattern for the month.
        Check on your pattern to see it grow and changes as you build your new habits and routines!
      </p>
    </section>
  </main>
</template>
<style lang="css" scoped>
main {
  padding: 0;
}

.hero-section {
  width: 100%;
  height: 100vh;
  position: relative;
  /* margin-top: var(--sp-xl); */
  /* margin-inline: auto; */

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: var(--sp-md);
  background-color: transparent;
  background-color: rgba(0, 0, 0, 0.3);
  /* border-radius: var(--br-lg); */
  padding: var(--sp-lg);
  text-align: center;
}

.hero-section::after {
  /* border-radius: var(--br-lg); */
  z-index: -1;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-image: linear-gradient(
    45deg,
    hsl(282deg 44% 47%) 0%,
    hsl(300deg 45% 45%) 18%,
    hsl(315deg 53% 49%) 26%,
    hsl(324deg 62% 52%) 33%,
    hsl(332deg 73% 55%) 39%,
    hsl(339deg 83% 58%) 44%,
    hsl(347deg 91% 62%) 50%,
    hsl(355deg 97% 65%) 56%,
    hsl(5deg 100% 66%) 61%,
    hsl(14deg 100% 63%) 67%,
    hsl(22deg 100% 60%) 74%,
    hsl(29deg 96% 56%) 82%,
    hsl(37deg 90% 51%) 100%
  );

  filter: blur(5px);
}

h1 {
  font-size: var(--fs-4);
}

.cta-btn {
  background-color: var(--c-tertiary);
  /* border: solid var(--c-bg); */
  padding: var(--sp-sm);
  border-radius: var(--br-md);
  text-decoration: none;
}

.info-section {
  padding: var(--sp-xl);
}

h2 {
  margin-block: var(--sp-md);
}
</style>
