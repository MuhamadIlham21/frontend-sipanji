<template>
  <div class="min-h-screen bg-background">
    <UserAppSidebar />
    <UserAppHeader :title="route.meta.title" :subtitle="route.meta.subtitle || ''" />

    <!-- Main Content -->
    <main
      class="min-h-screen pt-16 px-4 lg:px-6 pb-6 transition-all duration-200"
      :class="isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'"
    >
      <Breadcrumb class="my-5" />
      <slot name="main-admin" />
    </main>

    <ToastContainer />

    <!-- Footer -->
    <footer
      class="bg-surface border-t border-surface-2 py-4 px-4 lg:px-6 transition-all duration-200"
      :class="isSidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'"
    >
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-text-faint"
      >
        <p>&copy; {{ new Date().getFullYear() }} SiPanji — Sistem Pengendalian Operasional Haji</p>
        <div class="flex items-center gap-3">
          <a href="#" class="hover:text-text-muted transition-colors">Kebijakan Privasi</a>
          <span>·</span>
          <a href="#" class="hover:text-text-muted transition-colors">Syarat Layanan</a>
          <span>·</span>
          <a href="#" class="hover:text-text-muted transition-colors">Bantuan</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSidebarStore } from '@/stores/sidebar'
import UserAppSidebar from '@/components/Sidebar/UserAppSidebar.vue'
import UserAppHeader from '@/components/Header/UserAppHeader.vue'
import Breadcrumb from '@/components/Common/BreadCrumb.vue'
import ToastContainer from '@/components/Toast/ToastContainer.vue'

const route = useRoute()
const sidebar = useSidebarStore()
const isSidebarExpanded = computed(() => sidebar.is_expanded)
</script>
