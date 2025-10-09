<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import ListDayChanger from '@client/components/ListDayChanger.vue'
import HabitList from '@client/components/HabitList.vue'
import { sync } from '@client/dexie/dexieSchema'
import { getAuthObject } from '@client/lib/auth'
import FeatherIcon from '@client/components/FeatherIcon.vue'

const current_day = ref(new Date())
const queue_length = ref(0)
// TODO: Improve sync status UI and feedback
const sync_status = computed<'Unsaved Changes' | 'Changes Saved' | 'Error'>(() => {
  if (queue_length.value > 0) return 'Unsaved Changes'
  if (queue_length.value === 0) return 'Changes Saved'
  return 'Error'
})

function changeDay(action: 'next' | 'previous') {
  let date = current_day.value.getDate()
  if (action === 'previous') date -= 1
  if (action === 'next') date += 1
  current_day.value = new Date(current_day.value.setDate(date))
}

async function updateQueueLength(l: number) {
  if (queue_length.value >= 0 && queue_length.value < 3) {
    queue_length.value = l
  }

  const user = getAuthObject()
  if (queue_length.value >= 3 && user) {
    const new_queue = await sync.save(user.accessToken)
    queue_length.value = new_queue
  }
}

async function saveChanges() {
  const user = getAuthObject()
  if (user) {
    queue_length.value = await sync.save(user.accessToken)
  }
}

async function refreshData() {
  const user = getAuthObject()
  if (user) {
    const pull = await sync.pull(user.accessToken)
    if (pull.success) queue_length.value = pull.data
    else queue_length.value = -1
  }
}

onMounted(async () => (queue_length.value = (await sync.getQueue()).length))
onMounted(async () => {
  const user = await getAuthObject()
  if (user) {
    const pull = await sync.pull(user.accessToken)

    if (!pull.success) {
      queue_length.value = -1
    } else {
      queue_length.value = pull.data
    }
  }
})
</script>

<template>
  <section class="home_heading">
    <div>
      <h1>Habit<span>Stitch</span></h1>
      <div class="sync-status">
        <p>{{ sync_status }} {{ queue_length > 0 ? `(${queue_length})` : undefined }}</p>
        <button v-if="queue_length > 0" @click="saveChanges">
          <FeatherIcon icon="save" :size="20" />
        </button>
        <button v-if="queue_length === 0" @click="refreshData">
          <FeatherIcon icon="refresh-cw" :size="18" />
        </button>
      </div>
    </div>
    <CreateHabitForm @add-habit="updateQueueLength" />
  </section>
  <section class="date_display">
    <h2>{{ current_day.toDateString() }}</h2>
    <ListDayChanger
      @go-to-previous-day="changeDay('previous')"
      @go-to-next-day="changeDay('next')"
    />
  </section>
  <section class="habit_list">
    <HabitList :current_day="current_day" @update-queue="updateQueueLength" />
  </section>
</template>

<style scoped>
.home_heading {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.sync-status {
  display: flex;
  gap: 0.25rem;
}

.sync-status > button {
  padding: 0.2rem;
  background-color: transparent;
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
