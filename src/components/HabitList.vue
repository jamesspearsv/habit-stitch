<script setup lang="ts">
import { db } from '@client/dexie/dexieSchema'
import { getAuthObject } from '@client/lib/auth'
import type { Habit, Log } from '@shared/types'
import { parseDate } from '@client/lib/helpers'
import { computed, ref, watch } from 'vue'
import { deleteLog, insertLog, selectLogs } from '@client/dexie/dexieQueries'
import { liveQuery, type Subscription } from 'dexie'

const props = defineProps<{
  current_day: Date
}>()

const habits = ref<Habit[]>([])
const logs = ref<Log[]>([])

const subscriptions = ref<{ habits: Subscription; logs: Subscription }>()

// Map any logs for the current day to
// their related habit using habit_id
const logged_habits = computed(() =>
  habits.value.map((habit) => {
    const filteredLogs = logs.value.filter((l) => l.habit_id === habit.id)
    return { ...habit, related_log: filteredLogs[0]?.id }
  }),
)

// Open subscriptions for habits and logs and then
// watch the current_day property value for updates
watch(
  [() => props.current_day],
  async () => {
    // Unsubscribe from any existing subscriptions
    if (subscriptions.value) {
      subscriptions.value.habits.unsubscribe()
      subscriptions.value.logs.unsubscribe()
    }

    const habits_query = liveQuery(() => db.habits.orderBy('name').toArray())
    const habit_subscription = habits_query.subscribe({
      next(result) {
        habits.value = result
      },
      error(error) {
        habits.value = []
        console.error(error)
      },
    })

    const logs_query = liveQuery(() =>
      db.logs.where('created_on').equals(parseDate(props.current_day)).toArray(),
    )
    const logs_subscription = logs_query.subscribe({
      next: (result) => (logs.value = result),
      error: () => (logs.value = []),
    })

    subscriptions.value = { habits: habit_subscription, logs: logs_subscription }
  },
  { immediate: true },
)

async function updateHabitCheckmark(e: Event, log_id?: string) {
  const user_id = getAuthObject()?.user.id
  if (!user_id) return

  const checkbox = e.currentTarget as HTMLInputElement
  const habit_id = checkbox.id

  if (checkbox.checked) {
    // add new log to local indexDB
    await insertLog(user_id, habit_id, parseDate(props.current_day))
  } else {
    if (log_id) {
      await deleteLog(log_id)
    }
  }

  await selectLogs(parseDate(props.current_day))
}
</script>

<template>
  <article v-for="habit in logged_habits" :key="habit.id">
    <input
      class="checkbox"
      type="checkbox"
      :id="habit.id"
      :checked="habit.related_log ? true : false"
      @change="async (e) => await updateHabitCheckmark(e, habit.related_log)"
    />
    <p>{{ habit.name }}</p>
  </article>
</template>

<style scoped>
article {
  width: fit-content;
  display: flex;
  gap: 0.5rem;
  /* justify-content: space-between; */
  align-items: center;
  margin-bottom: 0.75rem;
}

p {
  flex: 2;
  position: relative;
}

.checkbox:checked + p::before {
  content: '';
  position: absolute;
  background-color: var(--c-text);
  top: 50%;
  width: 100%;
  height: 1px;

  /* TODO: add strikethrough starting style */
}

.checkbox {
  --checkbox-size: 1.25rem;
  --checkbox-offset: calc((var(--checkbox-size) - 1rem) / 2 * -1);
  appearance: none;
  position: relative;
}

.checkbox::before {
  transition-property: background-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  position: absolute;
  top: var(--checkbox-offset);
  left: 0;
  content: '';
  height: var(--checkbox-size);
  width: var(--checkbox-size);
  background-color: transparent;
  border: solid 1px var(--c-text);
  border-radius: 10px;
}

.checkbox:checked::before {
  background-color: var(--c-accent);
}
</style>
