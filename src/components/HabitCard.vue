// TODO: Add inner element to ensure contrast is readable
<script setup lang="ts">
import { logActivity, deleteActivity } from '@/lib/actions'
import { ref } from 'vue'

const props = defineProps<{
  id: string
  habit_name: string
  habit_color: string
  activity_id: string
}>()
const emit = defineEmits(['update'])

const completed = ref(props.activity_id ? true : false)

async function handleActivityLog(habit_id: string) {
  const result = await logActivity(habit_id)
  // Optimistically update the habit completed state
  if (result.success) {
    completed.value = true
    emit('update')
  }
}

async function handleActivityDelete(activity_id: string) {
  if (activity_id !== '') {
    const result = await deleteActivity(activity_id)
    if (result.success) {
      completed.value = false
      emit('update')
    }
  }
}
</script>
<template>
  <button
    :key="props.id"
    :class="{ habit: true, today: completed }"
    @click="
      () => {
        if (!completed) handleActivityLog(props.id)
        if (props.activity_id) handleActivityDelete(props.activity_id)
      }
    "
  >
    <div class="habit-name">
      {{ props.habit_name }}
    </div>
  </button>
</template>
<style scoped>
button.habit {
  position: relative;
  background-color: var(--c-bg-alt);
  padding: var(--sp-xxl) var(--sp-sm);
  border: solid var(--bs-0) color-mix(in srgb, var(--c-bg) 100%, #000 5%);
  border-radius: var(--br-md);
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-block: var(--sp-md);
}

button.today {
  background-color: v-bind(habit_color);
  color: var(--c-bg);
}

button::before {
  content: '';
  background-color: v-bind(habit_color);
  width: 3px;
  height: 100%;
  position: absolute;
  left: 0;
}

.habit-name {
  padding: var(--sp-xs);
  border: none;
  border-radius: var(--br-md);
}

button.today > .habit-name {
  background-color: var(--c-text);
  color: var(--c-bg);
}
</style>
