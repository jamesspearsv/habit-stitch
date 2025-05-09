import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/AppViews/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import AppView from '@/views/AppView.vue'
import { signout } from '@/lib/auth'
import { pb } from '@/lib/pb'
import LandingView from '@/views/LandingView.vue'
import SummaryView from '@/views/AppViews/SummaryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/landing', name: 'Landing', component: LandingView },
    {
      path: '/',
      name: 'App',
      component: AppView,
      children: [
        { path: '', name: 'Home', component: HomeView },
        { path: 'summary', name: 'Summary', component: SummaryView },
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
  console.log(to)
  const protectedPaths = ['/', '/pattern']
  // Check if the requested route is protected
  if (protectedPaths.includes(to.path)) {
    // Validate the current user
    if (!pb.authStore.isValid) {
      return { name: 'Landing' }
    }
  }

  if ((to.path === '/login' || to.path === '/signup') && pb.authStore.isValid) {
    return { name: 'Home' }
  }

  // Temp: signout route
  if (to.path === '/signout') {
    await signout()
    return { name: 'Landing' }
  }
})

export default router
