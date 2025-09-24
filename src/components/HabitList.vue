<script setup lang="ts">
import { db } from '@client/dexie/db'
import { getAuthObject } from '@client/lib/auth'
import type { Habit, Log } from '@shared/types'
import { parseDate } from '@client/lib/helpers'
import { onMounted, ref, watch } from 'vue'
import { selectLogs } from '@client/dexie/queries'
import { liveQuery } from 'dexie'

const props = defineProps<{
  current_day: Date
}>()

const habits = ref<Habit[]>([])
const logs = ref<Log[]>([])

// TODO: Map habits and logs together to derive completed habits

// Open a live query for the local
// habits table and update the state
// accordingly when there are changes
onMounted(async () => {
  const observable = liveQuery(() => db.habits.orderBy('name').toArray())
  observable.subscribe({
    next(result) {
      habits.value = result
    },
    error(error) {
      habits.value = []
      console.error(error)
    },
  })
})

// Get logs the current day immediately
// and watch the property value for updates
watch(
  [() => props.current_day, habits],
  async () => {
    try {
      const result = await selectLogs(parseDate(props.current_day))
      logs.value = result
    } catch (error) {
      console.error(error)
      logs.value = []
    }
  },
  { immediate: true },
)

async function updateHabitCheckmark(e: Event) {
  const user_id = getAuthObject()?.user.id
  if (!user_id) return

  const checkbox = e.currentTarget as HTMLInputElement
  const habit_id = checkbox.id

  if (checkbox.checked) {
    // add new log to local indexDB
    const log: Log = {
      id: crypto.randomUUID(),
      habit_id,
      created_on: parseDate(props.current_day),
      notes: '',
      user_id,
    }

    db.logs.add(log)
  } else {
    const result = await db.logs.where('habit_id').equals(habit_id).sortBy('timestamp')
    console.log(result)
  }
}
</script>

<template>
  <article v-for="habit in habits" :key="habit.id">
    <input
      class="checkbox"
      type="checkbox"
      :id="habit.id"
      @change="async (e) => await updateHabitCheckmark(e)"
    />
    <p>{{ habit.name }}</p>
  </article>
  <p v-for="log in logs" :key="log.id">{{ log.habit_id }} on {{ log.created_on }}</p>
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
