import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const is_expanded = ref(localStorage.getItem('is_expanded') === 'true')
  const is_sidebar_open = ref(false)

  const subMenuStates = ref({})

  const toggleMenu = () => {
    is_expanded.value = !is_expanded.value
    localStorage.setItem('is_expanded', is_expanded.value)
  }

  const toggleSidebar = () => {
    is_sidebar_open.value = !is_sidebar_open.value
  }

  const toggleSubMenu = (menuId) => {
    if (subMenuStates.value[menuId] === undefined) {
      subMenuStates.value[menuId] = true
    } else {
      subMenuStates.value[menuId] = !subMenuStates.value[menuId]
    }
  }

  const closeSidebarOnMobile = () => {
    is_sidebar_open.value = false
  }

  // Initialize submenu state for a menu
  const initSubMenuState = (menuId, isOpen = false) => {
    if (subMenuStates.value[menuId] === undefined) {
      subMenuStates.value[menuId] = isOpen
    }
  }

  // Check if route is active in submenu
  const isRouteInSubMenu = (children, routeName) => {
    if (!children) return false
    return children.some((child) => child.url === routeName)
  }

  return {
    is_expanded,
    is_sidebar_open,
    subMenuStates,
    toggleMenu,
    toggleSidebar,
    toggleSubMenu,
    closeSidebarOnMobile,
    initSubMenuState,
    isRouteInSubMenu,
  }
})
