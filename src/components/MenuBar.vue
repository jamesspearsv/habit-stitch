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
    <menu @click="() => (open = false)" :class="{ open: open }">
      <RouterLink :to="{ name: 'Summary' }">
        <div class="icon-container">
          <i data-feather="bar-chart"></i>
        </div>
      </RouterLink>
      <RouterLink :to="{ name: 'Home' }">
        <div class="icon-container">
          <i data-feather="home"></i>
        </div>
      </RouterLink>
      <RouterLink to="/signout">
        <div class="icon-container">
          <i data-feather="log-out"></i>
        </div>
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

.icon-container {
  padding-top: var(--sp-lg);
  padding-bottom: 3rem;
  display: flex;
  justify-content: center;
}
</style>
