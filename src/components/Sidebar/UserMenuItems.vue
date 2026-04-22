<template>
  <div class="space-y-0.5">
    <!-- Loading State -->
    <div v-if="menuStore.isLoading" class="flex items-center justify-center py-8">
      <div class="w-6 h-6 rounded-full border-2 border-white/20 border-t-accent animate-spin"></div>
    </div>

    <template v-else>
      <template v-for="menu in menuData" :key="menu.id">
        <!-- Section Label -->
        <div
          v-if="menu.isLabel"
          class="nav-section-label"
          :class="!sidebar.is_expanded && 'opacity-0 h-0 overflow-hidden py-0'"
        >
          {{ menu.nama_menu }}
        </div>

        <!-- Regular Menu Item -->
        <router-link
          v-else-if="!menu.isLabel"
          :to="{ name: menu.url }"
          @click="onMenuClick"
          class="nav-item"
          :class="[
            $route.name === menu.url ? 'active' : '',
            !sidebar.is_expanded && 'justify-center px-2',
          ]"
          :title="!sidebar.is_expanded ? menu.nama_menu : ''"
        >
          <span
            class="material-icons text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
          >
            {{ menu.icon }}
          </span>
          <span v-if="sidebar.is_expanded" class="truncate transition-opacity duration-200">
            {{ menu.nama_menu }}
          </span>
        </router-link>
      </template>

      <!-- Empty State -->
      <div v-if="menuData.length === 0" class="text-center py-8 px-3">
        <span class="material-icons text-white/30 text-3xl mb-2 block">menu_open</span>
        <p class="text-white/40 text-xs">Tidak ada menu tersedia</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import { useMenuStore } from '@/stores/menu'

const sidebar = useSidebarStore()
const menuStore = useMenuStore()
const route = useRoute()

const menuData = computed(() => menuStore.structuredMenus)

onMounted(() => {
  if (menuData.value.length > 0) initializeMenuStates()
})

watch(
  () => menuStore.userMenus.length,
  () => {
    if (menuData.value.length > 0) initializeMenuStates()
  },
)

watch(
  () => route.name,
  (newRouteName) => {
    menuData.value.forEach((menu) => {
      if (menu.children?.length > 0) {
        const isActive = sidebar.isRouteInSubMenu(menu.children, newRouteName)
        if (isActive) sidebar.subMenuStates[menu.id] = true
      }
    })
  },
  { immediate: true },
)

const initializeMenuStates = () => {
  menuData.value.forEach((menu) => {
    if (menu.children?.length > 0) {
      const isActive = sidebar.isRouteInSubMenu(menu.children, route.name)
      sidebar.initSubMenuState(menu.id, isActive)
    }
  })
}

const onMenuClick = () => sidebar.closeSidebarOnMobile()
</script>
