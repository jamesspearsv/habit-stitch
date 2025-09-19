<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import type { Habit } from '@shared/types'
import HabitList from '@client/components/HabitList.vue'
import { db } from '@client/db'
import { liveQuery, type Subscription } from 'dexie'

const habits = ref<Habit[] | null>(null)
const error = ref('')
const subscription = ref<Subscription | null>(null)

// Init live query and subscribe
// to data changes from DB
onMounted(async () => {
  // await fetchDexie()
  console.log('Subscribing to query...')
  const query = liveQuery(() => {
    return db.habits.orderBy('name').toArray()
  })

  subscription.value = query.subscribe({
    next: (result) => {
      habits.value = result
    },
    error: (error) => {
      habits.value = null
      error.value = 'Unable to find habits'
    },
  })
})

// Close DB subscription when
// component is unmounted
onUnmounted(() => {
  console.log('Unsubscribing from query...')
  subscription.value?.unsubscribe()
})
</script>

<template>
  <div>
    <h1>Habit<span>Stitch</span></h1>
  </div>
  <CreateHabitForm />
  <div v-if="error">{{ error }}</div>
  <section v-if="habits && !error">
    <HabitList :habits="habits" />
    <br />
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

// async function fetchData() { // // TODO: extract all API calls into an independent function //
const res = await fetch('/api/habits', { // method: 'GET', // headers: { // Authorization: `Bearer
${getAuthObject()?.accessToken}`, // }, // }) // if (res.status === 500) { // logOut() // return
router.push({ name: 'Landing' }) // } // const json = await res.json() // // Validate API response
// const safeJSON = HabitsResponseSchema.safeParse(json) // if (!safeJSON.success) { // return
(error.value = safeJSON.error.flatten.toString()) // } // // Parse and use response data // if
(safeJSON.data.success) { // habits.value = safeJSON.data.data // } // }
