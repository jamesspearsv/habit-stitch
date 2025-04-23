<template>
  <nav>
    <ul>
      <li>
        <RouterLink to="/todo">Habits</RouterLink>
      </li>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/todo">History</RouterLink>
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
  background-color: var(--color-secondary);
}

ul {
  height: var(--spacing-xxl);
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: var(--spacing-md);
}

a {
  text-decoration: none;
}

a.router-link-active {
  color: var(--color-accent);
  font-weight: 700;
  font-size: var(--font-2);
}
</style>
