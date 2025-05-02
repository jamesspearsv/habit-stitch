<template>
  <nav>
    <slot />
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--c-secondary);
}
</style>
