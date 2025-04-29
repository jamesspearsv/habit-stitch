<script lang="ts" setup>
import { signin } from '@/lib/auth'
import router from '@/router/router'
import { ref } from 'vue'

const formData = ref({
  email: '',
  password: '',
})

async function handleSubmit() {
  const result = await signin(formData.value)
  if (result.success) {
    router.push({ name: 'Home' })
  } else {
    return false
  }
}
</script>

<template>
  <main>
    <h1>Login Page</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form_group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" v-model="formData.email" />
      </div>
      <div class="form_group">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" v-model="formData.password" />
      </div>
      <input type="submit" value="Login" />
    </form>
  </main>
  <div class="signup">
    <RouterLink :to="{ name: 'Signup' }">Create an account here!</RouterLink>
  </div>
</template>

<style scoped>
.signup {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-block: var(--sp-md);
}
</style>
