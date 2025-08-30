<script setup lang="ts">
async function handleClick() {
  const res = await fetch('/api')
  const json = await res.json()
  alert(JSON.stringify(json))
}
</script>
<template>
  <main>
    <button @click="handleClick">Access Basic Worker Code</button>
  </main>
</template>
<style>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}
</style>
