<script setup lang="ts"></script>
<template>
  <section>
    <slot />
  </section>
</template>
<style scoped>
section {
  width: 100%;
  padding-block: var(--sp-md);
  display: flex;
  justify-content: center;
}
</style>
