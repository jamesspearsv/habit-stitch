<script setup lang="ts">
import { onMounted } from 'vue'
import * as feather from 'feather-icons'

const props = defineProps<{ icon: keyof typeof feather.icons }>()

onMounted(() => {
  feather.replace()
})
</script>

<template>
  <div class="icon-container">
    <i v-bind:data-feather="props.icon"></i>
  </div>
</template>

<style scoped>
.icon-container {
  display: flex;
  justify-content: center;
}
</style>
