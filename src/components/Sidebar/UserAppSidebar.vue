<template>
  <div>
    <!-- Sidebar -->
    <aside
      class="sidebar-wrapper"
      :class="[
        sidebar.is_expanded ? 'w-64' : 'w-20',
        sidebar.is_sidebar_open ? 'z-60' : 'z-50',
        sidebar.is_sidebar_open ? '' : 'hidden md:flex',
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo Header -->
        <div class="shrink-0 px-3 pt-4 pb-2">
          <div class="sidebar-logo-area" :class="!sidebar.is_expanded && 'justify-center'">
            <img :src="logoURL" alt="Logo SiPanji" class="w-10 h-10 object-contain shrink-0" />
            <div v-if="sidebar.is_expanded" class="overflow-hidden min-w-0">
              <h4 class="text-text-inverse font-bold text-base truncate leading-tight">Si-Panji</h4>
              <p class="text-white/50 text-xs truncate">Sistem Informasi Pengendali Layanan Haji</p>
            </div>
          </div>
          <div class="sidebar-divider mt-3"></div>
        </div>

        <!-- Toggle Button -->
        <div
          class="shrink-0 flex px-3 mb-2"
          :class="sidebar.is_expanded ? 'justify-end' : 'justify-center'"
        >
          <button
            class="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            @click="sidebar.toggleMenu"
            :title="sidebar.is_expanded ? 'Perkecil sidebar' : 'Perbesar sidebar'"
          >
            <span
              class="material-icons text-xl transition-transform duration-300"
              :class="sidebar.is_expanded ? 'rotate-180' : ''"
            >
              keyboard_double_arrow_right
            </span>
          </button>
        </div>

        <!-- Menu Items (Scrollable) -->
        <div class="flex-1 overflow-y-auto px-3">
          <UserMenuItems />
        </div>

        <!-- Logout -->
        <div class="shrink-0 px-3 py-3 border-t border-white/10">
          <button
            class="sidebar-logout"
            :class="!sidebar.is_expanded && 'justify-center'"
            @click="modalLogoutConfirm"
            :disabled="isLoggingOut"
          >
            <span class="material-icons text-xl" :class="isLoggingOut && 'animate-spin'">
              {{ isLoggingOut ? 'hourglass_empty' : 'logout' }}
            </span>
            <span v-if="sidebar.is_expanded">
              {{ isLoggingOut ? 'Keluar...' : 'Logout' }}
            </span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Logout Confirmation Modal -->
    <Transition name="fade">
      <div
        v-if="showLogoutConfirm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
        style="z-index: 9999"
        @click.self="showLogoutConfirm = false"
      >
        <div class="bg-surface rounded-xl p-6 w-full max-w-sm shadow-2xl">
          <h3 class="text-lg font-bold text-text mb-1">Konfirmasi Logout</h3>
          <p class="text-text-muted text-sm mb-6">Apakah Anda yakin ingin keluar dari sistem?</p>
          <div class="flex gap-3">
            <button
              @click="showLogoutConfirm = false"
              class="flex-1 px-4 py-2.5 border border-surface-2 rounded-lg text-text-muted hover:bg-surface-2 transition-colors text-sm font-medium"
            >
              Batal
            </button>
            <button
              @click="handleLogout"
              class="flex-1 px-4 py-2.5 bg-error text-text-inverse rounded-lg hover:bg-error/90 transition-colors text-sm font-medium"
            >
              Ya, Logout
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Mobile Overlay -->
    <Transition name="fade">
      <div
        v-if="sidebar.is_sidebar_open"
        @click="sidebar.toggleSidebar"
        class="fixed inset-0 bg-black/50 z-30 md:hidden"
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import { useAuthStore } from '@/stores/auth'
import UserMenuItems from './UserMenuItems.vue'
import logoURL from '@/assets/logo.png'

const sidebar = useSidebarStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoggingOut = ref(false)
const showLogoutConfirm = ref(false)

const modalLogoutConfirm = () => {
  showLogoutConfirm.value = true
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    authStore.logout()
    sidebar.is_sidebar_open = false
    sidebar.is_expanded = false
    await router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
    showLogoutConfirm.value = false
  }
}
</script>
