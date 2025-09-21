<script setup lang="ts">
defineEmits(['goToPreviousDay', 'goToNextDay'])
</script>
<template>
  <button id="previous_day_button" @click="$emit('goToPreviousDay')"></button>
  <button id="next_day_button" @click="$emit('goToNextDay')"></button>
</template>
<style lang="css" scoped>
button {
  min-height: 3rem;
  min-width: 1.5rem;
  position: fixed;
  top: calc(50% - 0.5rem);
}

#previous_day_button {
  left: 0.25rem;
}

#next_day_button {
  right: 0.25rem;
}
</style>
