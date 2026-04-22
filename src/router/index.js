// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'

const router = createRouter({
  routes,
  history: createWebHistory(),
})

// ==========================================
// ROUTER GUARDS
// ==========================================

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const menuStore = useMenuStore()

  // 0. Restore session
  if (!authStore.token) {
    authStore.checkAuth()
  }

  // 1. Public routes
  const publicRoutes = ['login', 'dashboard']
  if (publicRoutes.includes(to.name)) {
    await menuStore.fetchUserMenus()
    return true
  }

  // 2. Login page redirect if already logged in
  if (to.name === 'login') {
    if (authStore.isAuthenticated) {
      return { name: 'dashboard' }
    }
    return true
  }

  // 3. Protected routes
  if (!authStore.isAuthenticated && to.meta.requiresAuth) {
    return {
      name: 'login',
      query: { redirect: to.fullPath },
    }
  }

  await menuStore.fetchUserMenus()

  return true
})
// ==========================================
// OPTIONAL: Cleanup on route change
// ==========================================
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - SiPanji` : 'SiPanji'
})

export default router
