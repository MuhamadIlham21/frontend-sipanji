<!-- src/components/Toast/ToastContainer.vue -->
<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-9999 space-y-3 max-w-md">
      <TransitionGroup
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-x-full opacity-0"
        enter-to-class="transform translate-x-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0 opacity-100"
        leave-to-class="transform translate-x-full opacity-0"
      >
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="relative flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm"
          :class="getToastClass(toast.type)"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            <span class="material-icons text-xl" :class="getIconClass(toast.type)">
              {{ getIcon(toast.type) }}
            </span>
          </div>

          <!-- Message -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" :class="getTextClass(toast.type)">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close Button -->
          <button
            @click="toastStore.remove(toast.id)"
            class="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <span class="material-icons text-lg" :class="getIconClass(toast.type)"> close </span>
          </button>

          <!-- Progress Bar -->
          <div
            v-if="toast.duration > 0"
            class="absolute bottom-0 left-0 h-1 rounded-full"
            :class="getProgressClass(toast.type)"
            :style="{
              animation: `shrink ${toast.duration}ms linear`,
            }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const getToastClass = (type) => {
  const classes = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-orange-50 border-orange-200',
    info: 'bg-blue-50 border-blue-200',
  }
  return classes[type] || classes.info
}

const getIconClass = (type) => {
  const classes = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600',
  }
  return classes[type] || classes.info
}

const getTextClass = (type) => {
  const classes = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-orange-800',
    info: 'text-blue-800',
  }
  return classes[type] || classes.info
}

const getProgressClass = (type) => {
  const classes = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-orange-600',
    info: 'bg-blue-600',
  }
  return classes[type] || classes.info
}

const getIcon = (type) => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
@keyframes shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
