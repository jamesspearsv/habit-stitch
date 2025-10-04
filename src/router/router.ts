import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@client/views/HomeView.vue'
import LoginView from '@client/views/LoginView.vue'
import SignupView from '@client/views/SignupView.vue'
import AppView from '@client/views/AppView.vue'
import LandingView from '@client/views/LandingView.vue'
import WorkerView from '@client/views/WorkerView.vue'
import PullView from '@client/views/PullView.vue'
import { isLoggedIn, logOut } from '@client/lib/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/worker', name: 'Worker', component: WorkerView },
    { path: '/landing', name: 'Landing', component: LandingView },
    {
      path: '/',
      name: 'App',
      component: AppView,
      children: [
        { path: '', name: 'Home', component: HomeView },
        { path: '/pull', name: 'Pull', component: PullView },
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
  const protectedViews = ['Home', 'Summary']
  if (protectedViews.includes(to.name as string)) {
    if (!isLoggedIn()) return { name: 'Landing' }
  }

  if (to.path === '/signout') {
    logOut()
    router.push({ name: 'Landing' })
  }
})

export default router
