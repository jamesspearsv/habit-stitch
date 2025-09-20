<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import { type Log, type Habit } from '@shared/types'
import HabitList from '@client/components/HabitList.vue'
import { liveQuery, type Subscription } from 'dexie'
import { getAuthObject } from '@client/lib/auth'
import { db } from '@client/db'
import { isDateToday } from '@client/lib/helpers'

// TODO: Add a derived reference that maps habits to completed logs.
const habits = ref<Habit[]>([])
const logs = ref<Log[]>([])

const error = ref('')
const habitSub = ref<Subscription | null>(null)
const logSub = ref<Subscription | null>(null)

// Init live query and subscribe
// to data changes from DB
onMounted(async () => {
  // await fetchDexie()

  const uid = getAuthObject()?.user.id
  if (!uid) return

  console.log('Subscribing to query...')
  const habitQuery = liveQuery(() => db.habits.orderBy('name').toArray())
  const logQuery = liveQuery(() =>
    db.log.filter((log) => isDateToday(new Date(log.timestamp))).toArray(),
  )

  habitSub.value = habitQuery.subscribe({
    next: (result) => {
      habits.value = result
      error.value = ''
    },
    error: () => {
      habits.value = []
      error.value = 'Unable to find habits'
    },
  })

  logSub.value = logQuery.subscribe({
    next: (result) => {
      logs.value = result
      error.value = ''
    },
    error: () => {
      logs.value = []
      error.value = 'Unable to find log'
    },
  })
})

// Close DB subscription when
// component is unmounted
onUnmounted(() => {
  console.log('Unsubscribing from query...')
  habitSub.value?.unsubscribe()
  logSub.value?.unsubscribe()
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
    <div v-for="log in logs" :key="log.id">
      <p>{{ log.id }} | {{ log.timestamp }}</p>
      <br />
    </div>
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
