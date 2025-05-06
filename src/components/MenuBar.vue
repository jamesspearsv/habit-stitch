<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

// TODO: fix menu bar top position changing when scrolling on mobile
<template>
  <nav :class="{ open: open }">
    <!--
      TODO: Fix event bubbling when clicking menu element
      -->
    <menu @click="() => (open = false)">
      <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'Habit Pattern' }">Habit Patterns</RouterLink>
    </menu>
    <button @click="() => (open = !open)">
      <div>Menu</div>
      <div class="menu-icon">▲</div>
    </button>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 92dvh;
  padding: var(--sp-sm);
  background-color: var(--c-bg-alt);
  border-top: solid 1px var(--c-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  transition-property: top border-top;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  z-index: 100;
}

nav.open {
  top: 0;
  border: none;
}

button {
  background-color: inherit;
  display: flex;
  align-items: center;
  gap: var(--sp-sm);
}

.menu-icon {
  transition: transform 200ms ease-in-out;
}

nav.open .menu-icon {
  transform: rotate(180deg);
}

menu {
  height: 0;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--sp-xs);
  transition: height 200ms ease-in-out;
}

nav.open menu {
  height: 90dvh;
}
</style>
