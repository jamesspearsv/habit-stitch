import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { signout } from '@/lib/auth'
import { pb } from '@/lib/pb'
import SignupView from '@/views/SignupView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/today',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    { path: '/signup', name: 'Signup', component: SignupView },
  ],
})

router.beforeEach(async (to) => {
  const protectedRoutes = ['/today']
  // Check if the requested route is protected
  if (protectedRoutes.includes(to.path)) {
    // Validate the current user
    if (!pb.authStore.isValid) {
      return { name: 'Login' }
    }
  }

  // Temp: signout route
  if (to.path === '/signout') {
    await signout()
    return { name: 'Login' }
  }
})

export default router
