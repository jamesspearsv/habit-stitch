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
  --border-width: 5px;
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
  border: solid var(--border-width) transparent;
  border-left: none;
  transition: background-color border-color;
  transition-duration: 250ms;
  transition-timing-function: ease-in-out;
}

button.today {
  background-color: color-mix(in srgb, v-bind(habit_color), #000000 40%);
  border-color: v-bind(habit_color);
}

button::before {
  content: '';
  background-color: v-bind(habit_color);
  width: var(--border-width);
  height: calc(100% + var(--border-width));
  position: absolute;
  left: 0;
  border-radius: var(--br-md);
}

.habit-name {
  padding: var(--sp-xs);
  border: none;
  border-radius: var(--br-md);
  font-weight: bold;
}

button.today > .habit-name {
  color: color-mix(in srgb, v-bind(habit_color), #ffffff 75%);
}
</style>
