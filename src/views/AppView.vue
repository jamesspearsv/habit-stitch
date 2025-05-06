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
  padding: var(--sp-sm);
  margin-bottom: 7dvh;
}

@media screen and (min-width: 768px) {
  main {
    width: 50%;
    margin: auto;
  }
}
</style>
