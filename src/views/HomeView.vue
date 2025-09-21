<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CreateHabitForm from '@client/components/CreateHabitForm.vue'
import ListDayChanger from '@client/components/ListDayChanger.vue'
import { db } from '@client/dexie/db'
import type { Habit } from '@shared/types'
import { liveQuery } from 'dexie'
import HabitList from '@client/components/HabitList.vue'

const current_day = ref(new Date())
const habits = ref<Habit[]>([])

function changeDay(action: 'next' | 'previous') {
  let date = current_day.value.getDate()
  if (action === 'previous') date -= 1
  if (action === 'next') date += 1
  current_day.value = new Date(current_day.value.setDate(date))
}

onMounted(() => {
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
</script>

<template>
  <section class="home_heading">
    <h1>Habit<span>Stitch</span></h1>
    <CreateHabitForm />
  </section>
  <section>
    <p>{{ current_day.toLocaleDateString() }}</p>
    <ListDayChanger
      @go-to-previous-day="changeDay('previous')"
      @go-to-next-day="changeDay('next')"
    />
  </section>
  <section>
    <HabitList :habits="habits" />
  </section>
</template>

<style scoped>
.home_heading {
  display: flex;
  gap: 1rem;
  align-items: center;
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
