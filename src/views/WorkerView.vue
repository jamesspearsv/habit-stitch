<script setup lang="ts">
async function handleClick(route: string) {
  const res = await fetch(route)
  const json = await res.json()
  alert(JSON.stringify(json))
}
</script>
<template>
  <main>
    <button @click="() => handleClick('/api')">Access Basic Worker Code</button>
    <button @click="() => handleClick('/api/createTable')">Create Table</button>
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
