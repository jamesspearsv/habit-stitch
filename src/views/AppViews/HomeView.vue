<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import { getJWT, logOut } from '@client/lib/auth'
import router from '@client/router/router'
import { json } from 'zod'

const habits = ref<unknown[] | null>(null)
const error = ref('')

async function fetchData() {
  const res = await fetch('/api/habits', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  })

  if (res.status === 500) {
    logOut()
    return router.push({ name: 'Landing' })
  }

  const json = await res.json()
  console.log(json)

  habits.value = json.data
}

// Fetch habits from backend
onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <CreateHabitForm @update="async () => await fetchData()">
    <div>
      <h1>Habit<span>Stitch</span></h1>
    </div>
  </CreateHabitForm>
  <div v-if="error">{{ error }}</div>
  <section v-else>
    <div v-for="habit in habits" v-bind:key="JSON.stringify(habit)">
      <p>{{ JSON.stringify(habit) }}</p>
      <br />
    </div>
    <!--
    <HabitCard
    @update="async () => await fetchData()"
    v-for="habit in habits"
    :key="habit.id"
    :id="habit.id"
    :habit_name="habit.habit_name"
    :activity_id="habit.activity_id"
    :habit_color="habit.habit_color"
    />
    -->
  </section>
</template>

<style scoped>
h1 {
  font-size: var(--fs-4);
  font-weight: bold;
}
h1 > span {
  background: linear-gradient(90deg, #17898f 0%, #f6c44b 50%, #b72a3a 100%);
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  width: max-content;
}

.nav-section {
  padding: var(--sp-md);
  display: flex;
  justify-content: center;
}
</style>
