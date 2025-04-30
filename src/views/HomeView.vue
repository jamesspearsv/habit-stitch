<script lang="ts" setup>
import HabitsGrid from '@/components/HabitsGrid.vue'
import { useTemplateRef } from 'vue'
const dialog = useTemplateRef('dialog')

function openDialog() {
  if (dialog.value) {
    dialog.value.showModal()
  }
}
</script>

<template>
  <main>
    <button @click="openDialog">New Habit</button>
    <HabitsGrid />
    <dialog ref="dialog">
      <section>
        <h2>Add a new habit</h2>
      </section>
    </dialog>
  </main>
</template>

<style scoped>
main {
  margin: var(--sp-xl);
}

dialog {
  border: none;
  border-radius: var(--br-lg);
  background-color: var(--c-bg);
  width: 90%;
  height: 90%;
  margin: auto;
  padding: var(--sp-md);

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
