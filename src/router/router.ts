import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import AppView from '@/views/AppView.vue'
import { signout } from '@/lib/auth'
import { pb } from '@/lib/pb'
import HabitPatternView from '@/views/HabitPatternView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/app',
      name: 'App',
      component: AppView,
      children: [
        { path: '', name: 'Home', component: HomeView },
        { path: 'pattern', name: 'Habit Pattern', component: HabitPatternView },
      ],
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
  // Check if the requested route is protected
  if (to.path.match('/app')) {
    // Validate the current user
    if (!pb.authStore.isValid) {
      return { name: 'Login' }
    }
  }

  if (to.path === '/login' && pb.authStore.isValid) {
    return { name: 'Home' }
  }

  // Temp: signout route
  if (to.path === '/signout') {
    await signout()
    return { name: 'Login' }
  }
})

export default router
