<script setup lang="ts">
import { handle } from 'hono/cloudflare-pages'

async function handleClick(route: string) {
  if (route) {
    const res = await fetch(route)
    const json = await res.json()
    alert(JSON.stringify(json))
  }
}
</script>
<template>
  <main>
    <button @click="() => handleClick('')">Placeholder</button>
  </main>
</template>
<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}
</style>
