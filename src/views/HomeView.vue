<script lang="ts" setup>
import { ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import ListDayChanger from '@client/components/ListDayChanger.vue'
import HabitList from '@client/components/HabitList.vue'
import { selectSyncQueue } from '@client/dexie/dexieQueries'
import { getAuthObject } from '@client/lib/auth'

const current_day = ref(new Date())

function changeDay(action: 'next' | 'previous') {
  let date = current_day.value.getDate()
  if (action === 'previous') date -= 1
  if (action === 'next') date += 1
  current_day.value = new Date(current_day.value.setDate(date))
}

async function syncLocalData() {
  /* 
  1. query entire sync queue
  2. Send POST request to /sync/push
  3. await response from sync server
  */

  const user = getAuthObject()
  if (!user) {
    console.error('no user')
    return
  }

  const queue = await selectSyncQueue()

  const res = await fetch('/sync/push', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify(queue),
  })

  console.log(await res.json())

  // TODO: Remove successful operations from the sync queue
}
</script>

<template>
  <section class="home_heading">
    <h1>Habit<span>Stitch</span></h1>
    <CreateHabitForm />
    <button @click="syncLocalData">Sync</button>
  </section>
  <section class="date_display">
    <h2>{{ current_day.toDateString() }}</h2>
    <ListDayChanger
      @go-to-previous-day="changeDay('previous')"
      @go-to-next-day="changeDay('next')"
    />
  </section>
  <section class="habit_list">
    <HabitList :current_day="current_day" />
  </section>
</template>

<style scoped>
.home_heading {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.date_display {
  margin-block: 1rem;
}

.habit_list {
  margin: 2rem;
}

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
