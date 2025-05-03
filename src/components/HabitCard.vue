<script setup lang="ts">
import { logActivity, deleteActivity } from '@/lib/actions'
import { ref } from 'vue'

const props = defineProps<{
  id: string
  habit_name: string
  activity_id: string
}>()
const emit = defineEmits(['stale-data'])

const completed = ref(props.activity_id ? true : false)

async function handleActivityLog(habit_id: string) {
  const result = await logActivity(habit_id)
  // Optimistically update the habit completed state
  if (result.success) {
    completed.value = true
    emit('stale-data')
  }
}

async function handleActivityDelete(activity_id: string) {
  if (activity_id !== '') {
    const result = await deleteActivity(activity_id)
    if (result.success) {
      completed.value = false
      emit('stale-data')
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
    {{ props.habit_name }}
  </button>
</template>
