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
  margin-bottom: var(--menu-height);
}

@media screen and (min-width: 768px) {
  main {
    width: 50%;
    margin: auto;
    margin-bottom: var(--menu-height);
  }
}
</style>
