import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@client/views/AppViews/HomeView.vue'
import LoginView from '@client/views/LoginView.vue'
import SignupView from '@client/views/SignupView.vue'
import AppView from '@client/views/AppView.vue'
import LandingView from '@client/views/LandingView.vue'
import SummaryView from '@client/views/AppViews/SummaryView.vue'
import WorkerView from '@client/views/WorkerView.vue'
import { isLoggedIn } from '@client/lib/auth'

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

// router.beforeEach(async (to) => {
//   // console.log(to)
//   const protectedPaths = ['/', '/pattern']
//   // Check if the requested route is protected
//   if (protectedPaths.includes(to.path)) {
//     // Validate the current user
//     if (!pb.authStore.isValid) {
//       return { name: 'Landing' }
//     }
//   }

//   if ((to.path === '/login' || to.path === '/signup') && pb.authStore.isValid) {
//     return { name: 'Home' }
//   }

//   // Temp: signout route
//   if (to.path === '/signout') {
//     await signout()
//     return { name: 'Landing' }
//   }
// })

router.beforeEach(async (to) => {
  const protectedViews = ['Home', 'Summary']

  if (protectedViews.includes(to.name as string)) {
    if (!isLoggedIn()) return { name: 'Landing' }
  }
})

export default router
