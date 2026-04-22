// src/stores/toast.js
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let idCounter = 0

  const show = (message, type = 'info', duration = 3000) => {
    const id = idCounter++

    toasts.value.push({
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration,
    })

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Convenience methods
  const success = (message, duration = 3000) => show(message, 'success', duration)
  const error = (message, duration = 4000) => show(message, 'error', duration)
  const warning = (message, duration = 3000) => show(message, 'warning', duration)
  const info = (message, duration = 3000) => show(message, 'info', duration)

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
})
