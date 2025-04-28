import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { signout } from '@/lib/auth'
import { pb } from '@/lib/pb'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
  ],
})

router.beforeEach(async (to) => {
  const protectedRoutes = ['/']
  // Check if the requested route is protected
  if (protectedRoutes.includes(to.path)) {
    // Validate the current user
    if (!pb.authStore.isValid) {
      console.log('protected')
      return { name: 'Login' }
    }
    console.log(pb.authStore.record)
  }

  // Temp: signout route
  if (to.path === '/signout') {
    await signout()
    return { name: 'Login' }
  }
})

export default router
