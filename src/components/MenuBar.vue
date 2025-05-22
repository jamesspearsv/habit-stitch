<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as feather from 'feather-icons'

onMounted(() => {
  feather.replace()
})

const open = ref(false)
</script>

<template>
  <nav :class="{ open: open }">
    <!-- TODO: Fix event bubbling when clicking menu element -->
    <menu @click="() => (open = false)" :class="{ open: open }">
      <RouterLink :to="{ name: 'Summary' }">
        <i data-feather="bar-chart"></i>
      </RouterLink>
      <RouterLink :to="{ name: 'Home' }">
        <i data-feather="home"></i>
      </RouterLink>
      <RouterLink to="/signout">
        <i data-feather="log-out"></i>
      </RouterLink>
    </menu>
    <!-- <div class="menu-bar">
      <button @click="() => (open = !open)">
        <div>Menu</div>
        <div class="menu-icon">▲</div>
      </button>
    </div> -->
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  background-color: var(--c-bg-alt);

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
  border-top: solid 1px var(--c-secondary);

  display: flex;
  justify-content: space-evenly;
  gap: var(--sp-lg);
  padding-block: var(--sp-md);
}

/* menu {
  height: 0;
  overflow-y: hidden;
  display: flex;
  align-items: center;
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
} */
</style>
