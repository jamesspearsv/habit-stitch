<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '@client/components/FeatherIcon.vue'

const open = ref(false)
</script>

<template>
  <nav :class="{ open: open }">
    <menu @click="() => (open = false)" :class="{ open: open }">
      <RouterLink :to="{ name: 'Home' }">
        <FeatherIcon icon="home" />
      </RouterLink>
      <RouterLink to="/signout">
        <FeatherIcon icon="log-out" />
      </RouterLink>
    </menu>
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

menu {
  border-top: solid 1px var(--c-secondary);
  display: flex;
  width: 100%;
}

menu > * {
  flex-grow: 1;
}

a > div {
  padding-top: var(--sp-lg);
  padding-bottom: 3rem;
}
</style>
