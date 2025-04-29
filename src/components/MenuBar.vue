<template>
  <nav>
    <ul>
      <li>
        <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
      </li>
    </ul>
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

ul {
  height: var(--sp-xxl);
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: var(--sp-md);
}

a {
  text-decoration: none;
}

a.router-link-active {
  color: var(--c-accent);
  font-weight: 700;
  font-size: var(--fs-2);
}
</style>
