<script setup lang="ts">
import { db } from '@client/dexie/db'
import { getAuthObject } from '@client/lib/auth'
import type { Habit, Log } from '@shared/types'
import { parseDate } from '@client/lib/helpers'

defineProps<{
  habits: Habit[]
}>()

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
      created_on: parseDate(new Date()),
      notes: '',
      user_id,
    }

    db.log.add(log)
  } else {
    const result = await db.log.where('habit_id').equals(habit_id).sortBy('timestamp')
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
