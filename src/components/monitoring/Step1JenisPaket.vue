<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Pilih Jenis Paket</h2>
      <p class="step-subtitle">Pilih jenis paket haji yang akan diawasi</p>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoadingForm" class="flex flex-col gap-3 mt-4">
      <div v-for="n in 2" :key="n" class="skeleton h-16 rounded-xl"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.formLoadError" class="error-state">
      <span class="material-icons text-[var(--color-error)] text-3xl">error_outline</span>
      <p class="text-sm text-[var(--color-error)] mt-2">{{ store.formLoadError }}</p>
      <button class="btn-secondary mt-3" @click="store.fetchFormData()">Coba Lagi</button>
    </div>

    <!-- Options -->
    <div v-else class="grid grid-cols-1 gap-3 mt-4">
      <button
        v-for="option in store.paketOptions"
        :key="option.id"
        type="button"
        class="radio-card"
        :class="{ active: store.formState.paket_id === option.id }"
        @click="store.setPaket(option)"
      >
        <span class="material-icons radio-card-icon">
          {{ option.value === 'reguler' ? 'groups' : 'star' }}
        </span>
        <div class="radio-card-content">
          <span class="radio-card-label">{{ option.label }}</span>
        </div>
        <span
          class="material-icons radio-card-check"
          :class="store.formState.paket_id === option.id ? 'opacity-100' : 'opacity-0'"
        >
          check_circle
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()

onMounted(() => {
  store.fetchFormData()
})
</script>
