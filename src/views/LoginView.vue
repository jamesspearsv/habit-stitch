<script lang="ts" setup>
import { signin } from '@/lib/auth'
import router from '@/router/router'
import { ref } from 'vue'

const formData = ref({
  email: '',
  password: '',
})

async function handleSubmit() {
  console.log(formData.value)
  const result = await signin(formData.value)
  if (result.success) {
    router.push('/')
  } else {
    return false
  }
}
</script>

<template>
  <main>
    <h1>Login Page</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input type="email" name="email" id="email" v-model="formData.email" />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" id="password" v-model="formData.password" />
      </div>
      <input type="submit" value="Login" />
    </form>
  </main>
  <div>
    <p>{{ formData.email }}</p>
    <p>{{ formData.password }}</p>
  </div>
</template>
