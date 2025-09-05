<script lang="ts" setup>
import { login } from '@client/lib/auth'
import { ref } from 'vue'

const formData = ref({
  email: '',
  password: '',
})
const error = ref('')

async function handleSubmit() {
  await login(formData.value)
  error.value = 'Unable to login'
}
</script>

<template>
  <main>
    <h1>Login Page</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" name="email" id="email" v-model="formData.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" v-model="formData.password" required />
      </div>
      <div class="form-group">
        <input type="submit" value="Login" />
        <div v-if="error" class="error-msg">{{ error }}</div>
      </div>
    </form>
  </main>
  <div class="signup">
    <RouterLink :to="{ name: 'Signup' }">Create an account here!</RouterLink>
  </div>
</template>

<style scoped>
main {
  width: 95%;
  margin: auto;
  padding-block: var(--sp-lg);
}

.signup {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-block: var(--sp-md);
}

.error-msg {
  color: var(--c-danger);
  font-style: italic;
}
</style>
