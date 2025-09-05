<script lang="ts" setup>
import { createUser } from '@client/lib/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const formData = ref({ email: '', password: '', name: '' })
const error = ref('')
const router = useRouter()

async function handleSubmit() {
  const result = await createUser(
    formData.value.name,
    formData.value.email,
    formData.value.password,
  )
  if (result) router.push({ name: 'Home' })
  error.value = 'Unable to create new user'
}
</script>

<template>
  <main>
    <h1>Sign up for Habit Stitch</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">What's your name?</label>
        <input type="text" name="name" id="name" v-model="formData.name" required />
      </div>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" name="email" id="email" v-model="formData.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="formData.password"
          required
          minlength="8"
        />
      </div>
      <div class="form-group">
        <input type="submit" value="Signup" />
        <div v-if="error" class="error-msg">{{ error }}</div>
      </div>
    </form>
  </main>
</template>

<style scoped>
main {
  width: 95%;
  margin: auto;
  padding-block: var(--sp-lg);
}

.error-msg {
  color: var(--c-danger);
  font-style: italic;
}
</style>
