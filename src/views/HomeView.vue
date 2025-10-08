<script lang="ts" setup>
import { ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import ListDayChanger from '@client/components/ListDayChanger.vue'
import HabitList from '@client/components/HabitList.vue'
import { clearSyncQueue, selectSyncQueue } from '@client/dexie/dexieQueries'
import { getAuthObject } from '@client/lib/auth'
import { SyncPushResponseSchema } from '@shared/zodSchemas'
import { sync } from '@client/dexie/dexieSchema'

const current_day = ref(new Date())

// TODO: Improve sync status UI and feedback
const sync_status = ref<'synced' | 'in progress' | 'unsynced'>('synced')

function changeDay(action: 'next' | 'previous') {
  let date = current_day.value.getDate()
  if (action === 'previous') date -= 1
  if (action === 'next') date += 1
  current_day.value = new Date(current_day.value.setDate(date))
}

async function syncLocalData() {
  const user = getAuthObject()
  if (!user) {
    console.error('no user')
    return
  }

  //  Query sync queue
  const queue = await selectSyncQueue()

  if (queue.length < 1) {
    console.log('No operations in sync queue...')
    return
  }

  // Send POST request to /sync/push
  sync_status.value = 'in progress'
  const res = await fetch('/sync/push', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify(queue),
  })

  // Parse and handle response from sync server
  const json = await res.json()

  // Remove successful operations from the sync queue
  const safe_json = SyncPushResponseSchema.safeParse(json)
  if (safe_json.success && safe_json.data.success) {
    await clearSyncQueue(safe_json.data.successful_operations)

    // set sync status
    sync_status.value = safe_json.data.failed_operations.length > 0 ? 'unsynced' : 'synced'
  }
}

async function pullFreshData() {
  const user = getAuthObject()
  if (!user) return
  await sync.pull(user.accessToken)
}
</script>

<template>
  <section class="home_heading">
    <h1>Habit<span>Stitch</span></h1>
    <CreateHabitForm />
    <div>
      <button @click="syncLocalData">{{ sync_status }}</button>
      <button @click="pullFreshData">pull</button>
    </div>
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
