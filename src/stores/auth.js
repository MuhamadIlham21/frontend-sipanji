// src/stores/auth.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api/auth-api'
import { useMenuStore } from '@/stores/menu'
import apiClient from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  // ==========================================
  // STATE
  // ==========================================
  const user = ref(null)
  const token = ref(null)
  const role = ref(null)
  const isLoading = ref(false)
  const message = ref('')
  const success = ref(null)

  // ==========================================
  // COMPUTED
  // ==========================================
  const isAuthenticated = computed(() => !!token.value)

  const hasRole = computed(() => (roleToCheck) => {
    return role.value === roleToCheck
  })

  // ==========================================
  // ACTIONS - LOGIN
  // ==========================================
  const login = async (credentials) => {
    isLoading.value = true
    message.value = 'Proses Login'
    success.value = null

    try {
      const response = await authApi.login({
        username: credentials.username,
        password: credentials.password,
      })

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login gagal')
      }

      const { access_token, token_type, expires_in, user: userData } = response.data.data

      token.value = access_token
      user.value = userData
      role.value = userData.role

      localStorage.setItem('auth_token', access_token)
      localStorage.setItem('token_type', token_type)
      localStorage.setItem('expires_in', expires_in)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('user_role', userData.role)
      localStorage.setItem('user_id', userData.id)

      message.value = response.data.message || 'Login berhasil'
      success.value = true

      return { success: true, message: message.value }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login gagal'
      message.value = errorMsg
      success.value = false
      return { success: false, message: errorMsg }
    } finally {
      isLoading.value = false
    }
  }

  // ==========================================
  // ACTIONS - LOGOUT
  // ==========================================
  const logout = async () => {
    try {
      if (token.value) {
        await apiClient.post('/auth/logout')
      }

      const menuStore = useMenuStore()

      // Clear state
      user.value = null
      token.value = null
      role.value = null
      message.value = ''
      success.value = null

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      localStorage.removeItem('user_role')
      localStorage.removeItem('token_type')
      localStorage.removeItem('expires_in')
      localStorage.removeItem('user_id')

      menuStore.clearMenus()
      return { success: true }
    } catch (error) {
      console.error('❌ Logout error:', error)
      return { success: false, message: error.message }
    }
  }

  // ==========================================
  // ACTIONS - CHECK AUTH
  // ==========================================
  const checkAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')
    const storedRole = localStorage.getItem('user_role')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      role.value = storedRole || user.value?.role

      return true
    }

    return false
  }

  return {
    // State
    user,
    token,
    role,
    isLoading,
    message,
    success,

    // Computed
    isAuthenticated,
    hasRole,

    // Actions
    login,
    logout,
    checkAuth,
  }
})
