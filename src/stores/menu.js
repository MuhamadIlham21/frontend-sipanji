import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const userMenus = ref([])
  const isLoading = ref(false)

  const masterMenuList = [
    {
      // id: 1,
      nama_menu: 'Dashboard',
      url: 'dashboard',
      icon: 'home',
      children: [],
    },
    {
      nama_menu: 'Laporan Monitoring',
      url: 'laporan.monitoring',
      icon: 'assignment_turned_in',
      children: [],
    },
  ]

  const structuredMenus = computed(() => {
    return userMenus.value
  })

  const fetchUserMenus = async () => {
    isLoading.value = true
    try {
      userMenus.value = masterMenuList
    } catch (error) {
      console.error('Error fetching user menus:', error)
    } finally {
      isLoading.value = false
    }
  }

  const clearMenus = () => {
    userMenus.value = []
  }

  return {
    userMenus,
    isLoading,

    structuredMenus,
    clearMenus,

    fetchUserMenus,
  }
})
