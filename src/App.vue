<script setup lang="ts">
import { RouterView } from 'vue-router'
import MenuBar from '@/components/MenuBar.vue'
</script>

<template>
  <RouterView />
  <MenuBar />
</template>

<style>
@media screen and (min-width: 768px) {
  body {
    width: 50%;
    margin: auto;
  }
}
</style>
