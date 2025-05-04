<script lang="ts" setup>
import CreateHabitForm from '@/components/CreateHabitForm.vue'
import HabitsGrid from '@/components/HabitsGrid.vue'
</script>

<template>
  <main>
    <h1>Today's Habits</h1>
    <HabitsGrid />
  </main>
  <CreateHabitForm />
</template>

<style scoped>
main {
  margin: var(--sp-xl);
}

.nav-section {
  padding: var(--sp-md);
  display: flex;
  justify-content: center;
}
</style>
