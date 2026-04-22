<template>
  <header
    class="fixed top-0 right-0 z-50 bg-surface shadow-sm border-b border-surface-2 transition-all duration-200"
    :class="!isMobile ? (isSidebarExpanded ? 'left-64' : 'left-20') : 'left-0'"
  >
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Left: Page Title -->
      <div>
        <h2 class="text-base font-semibold text-text leading-tight">{{ props.title }}</h2>
        <p class="text-xs text-text-muted">{{ props.subtitle }}</p>
      </div>

      <!-- Right: Profile & Hamburger -->
      <div class="flex items-center gap-2">
        <!-- Profile Dropdown -->
        <div class="relative profile-dropdown">
          <button
            @click="toggleProfile"
            class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-2 transition-colors"
          >
            <div class="avatar-circle">
              {{ userInitial }}
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-semibold text-text leading-tight">
                {{ isLoading ? '...' : user.name }}
              </p>
              <p class="text-xs text-text-muted">
                {{ isLoading ? '...' : user.email }}
              </p>
            </div>
            <span class="material-icons text-text-faint text-sm">
              {{ isProfileOpen ? 'expand_less' : 'expand_more' }}
            </span>
          </button>

          <!-- Dropdown Menu -->
          <Transition name="slide-fade">
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-2 w-52 bg-surface rounded-xl shadow-xl border border-surface-2 py-1 z-60 overflow-hidden"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-surface-2">
                <p class="text-sm font-semibold text-text truncate">{{ user.name }}</p>
                <p class="text-xs text-text-muted truncate">{{ user.email }}</p>
              </div>

              <!-- Logout -->
              <button
                @click="handleLogout"
                class="flex items-center gap-3 px-4 py-2.5 text-error hover:bg-error/10 transition-colors w-full text-left text-sm"
              >
                <span class="material-icons text-lg">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </Transition>
        </div>

        <!-- Mobile Hamburger -->
        <button
          @click="sidebar.toggleSidebar"
          class="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          aria-label="Toggle menu"
        >
          <span class="material-icons">menu</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '@/stores/sidebar'

const sidebar = useSidebarStore()

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})

const user = ref({ name: 'Belum login', email: '-' })
const isProfileOpen = ref(false)
const isMobile = ref(window.innerWidth < 768)
const isLoading = ref(false)

const isSidebarExpanded = computed(() => sidebar.is_expanded)
const userInitial = computed(() => user.value.name?.charAt(0).toUpperCase() || 'U')

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
}

const handleLogout = () => {
  // uncomment saat auth store siap
  // authStore.logout()
  // router.push('/user/login')
  isProfileOpen.value = false
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.profile-dropdown')) {
    isProfileOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
  const stored = localStorage.getItem('auth_user')
  if (stored) user.value = JSON.parse(stored)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>
