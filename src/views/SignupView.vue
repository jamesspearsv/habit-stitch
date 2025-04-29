<script lang="ts" setup>
import { createUser } from '@/lib/auth'
import router from '@/router/router'
import { ref } from 'vue'
const formData = ref({ email: '', password: '', name: '' })

async function handleSubmit() {
  const result = await createUser(formData.value)
  if (result.success) router.push({ name: 'Home' })
}
</script>

<template>
  <main>
    <h1>Sign up for Habit Stitch</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form_group">
        <label for="name">What's your name?</label>
        <input type="text" name="name" id="name" v-model="formData.name" required />
      </div>
      <div class="form_group">
        <label for="email">Email Address</label>
        <input type="email" name="email" id="email" v-model="formData.email" required />
      </div>
      <div class="form_group">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" v-model="formData.password" required />
      </div>
      <input type="submit" value="Signup" />
    </form>
  </main>
</template>
