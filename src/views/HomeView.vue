<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import ListDayChanger from '@client/components/ListDayChanger.vue'
import HabitList from '@client/components/HabitList.vue'
import { sync } from '@client/dexie/dexieSchema'
import { getAuthObject } from '@client/lib/auth'

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

// async function syncLocalData() {
//   const user = getAuthObject()
//   if (!user) {
//     console.error('no user')
//     return
//   }

//   const result = await sync.push(user.accessToken)

//   if (!result.success) {
//     console.error(result.message)
//   }

//   if (result.success) {
//     queue_length.value = result.data
//   }
// }

async function updateQueueLength(l: number) {
  if (l < 5 && l > 0) {
    // only update queue length state
    queue_length.value = l
  }

  if (l >= 5) {
    // sync changes & update queue length
    const user = getAuthObject()
    if (!user) return

    const push = await sync.push(user.accessToken)

    if (push.success) {
      const pull = await sync.pull(user.accessToken)
      if (pull.success) queue_length.value = pull.data
    } else {
      // handle error
      queue_length.value = -1
    }
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
      <p>{{ sync_status }} {{ queue_length > 0 ? `(${queue_length})` : undefined }}</p>
    </div>
    <CreateHabitForm />
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
