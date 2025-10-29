import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import AppHome from '@/pages/AppHome.vue'
import AppSigninForm from '@/pages/AppSigninForm.vue'
import AppSignUpForm from '@/pages/AppSignUpForm.vue'
import AppDashboard from '@/pages/AppDashboard.vue'

const routes = [
  { path: '/', name: 'home', component: AppHome },
  { path: '/signin', name: 'signin', component: AppSigninForm },
  { path: '/signup', name: 'signup', component: AppSignUpForm },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: AppDashboard,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

const isAuthenticated = () => {
  try {
    return localStorage.getItem('tms:auth') === 'true'
  } catch {
    return false
  }
}

router.beforeEach((to) => {
  // If route requires auth and user not authenticated, redirect to signin
  if (to.meta && to.meta.requiresAuth && !isAuthenticated()) {
    return {
      name: 'signin',
      query: { redirect: to.fullPath },
    }
  }

  // If navigating to signin while already authenticated, redirect to dashboard
  if (to.name === 'signin' && isAuthenticated()) {
    return { name: 'dashboard' }
  }
})

export default router
