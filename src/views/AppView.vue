<script setup lang="ts">
import MenuBar from '@/components/MenuBar.vue'
</script>
<template>
  <main>
    <RouterView />
  </main>
  <MenuBar />
</template>
<style scoped>
main {
  padding: var(--sp-lg);
  margin-bottom: 7dvh;
}
</style>
