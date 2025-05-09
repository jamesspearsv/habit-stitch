<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <nav :class="{ open: open }">
    <!--
      TODO: Fix event bubbling when clicking menu element
      -->
    <menu @click="() => (open = false)" :class="{ open: open }">
      <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
      <RouterLink :to="{ name: 'Habit Pattern' }">Habit Patterns</RouterLink>
      <RouterLink to="/signout">Signout</RouterLink>
    </menu>
    <div class="menu-bar">
      <button @click="() => (open = !open)">
        <div>Menu</div>
        <div class="menu-icon">▲</div>
      </button>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: var(--c-bg-alt);

  transition-property: top border-top;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  z-index: 100;
}

div.menu-bar {
  border-top: solid 1px var(--c-secondary);
  min-height: var(--menu-height);
  display: flex;
  align-items: center;
}

button {
  background-color: inherit;
  display: flex;
  align-items: center;
  gap: var(--sp-sm);
  margin: auto;
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
  /* align-items: center; */
  justify-content: center;
  flex-direction: column;
  width: 50%;
  margin: auto;
  gap: var(--sp-lg);
  transition: height 200ms ease-in-out;
}

menu a {
  background-color: var(--c-accent);
  padding: var(--sp-lg);
  border-radius: var(--br-lg);
  font-size: var(--fs-2);
  font-weight: 700;
  text-decoration: none;
  text-align: center;
}

menu.open {
  height: calc(100dvh - var(--menu-height));
}
</style>
