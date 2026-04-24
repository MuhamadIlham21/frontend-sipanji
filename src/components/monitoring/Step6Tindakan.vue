<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Pilih Tindakan</h2>
      <p class="step-subtitle">Tentukan jenis tindakan pengawasan yang dilakukan</p>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoadingForm" class="flex flex-col gap-3 mt-4">
      <div v-for="n in 2" :key="n" class="skeleton h-20 rounded-xl"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.formLoadError" class="error-state">
      <span class="material-icons text-[var(--color-error)] text-3xl">error_outline</span>
      <p class="text-sm text-[var(--color-error)] mt-2">{{ store.formLoadError }}</p>
      <button class="btn-secondary mt-3" @click="store.fetchFormData()">Coba Lagi</button>
    </div>

    <!-- Options Tindakan -->
    <div v-else class="grid grid-cols-1 gap-3 mt-4">
      <button
        v-for="option in store.tindakanOptions"
        :key="option.id"
        type="button"
        class="radio-card"
        :class="{ active: store.formState.tindakan_id === option.id }"
        @click="store.setTindakan(option)"
      >
        <span class="material-icons radio-card-icon">
          {{ TINDAKAN_ICON[option.value] ?? 'assignment' }}
        </span>
        <div class="radio-card-content">
          <span class="radio-card-label">{{ option.label }}</span>
          <span class="radio-card-desc text-xs text-[var(--color-text-muted)] mt-0.5">
            {{ TINDAKAN_DESC[option.value] ?? '' }}
          </span>
        </div>
        <span
          class="material-icons radio-card-check"
          :class="store.formState.tindakan_id === option.id ? 'opacity-100' : 'opacity-0'"
        >
          check_circle
        </span>
      </button>
    </div>

    <!-- Info box — muncul setelah pilih -->
    <Transition name="fade">
      <div
        v-if="store.formState.tindakan_value"
        class="info-box mt-5"
        :class="INFO_BOX_CLASS[store.formState.tindakan_value]"
      >
        <span class="material-icons text-xl shrink-0">info</span>
        <p class="text-sm">{{ INFO_BOX_TEXT[store.formState.tindakan_value] }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()

// Icon per value tindakan
const TINDAKAN_ICON = {
  daily_monitor: 'monitor_heart',
  temuan: 'report_problem',
}

// Deskripsi singkat per tindakan
const TINDAKAN_DESC = {
  daily_monitor: 'Pemantauan rutin kondisi operasional harian',
  temuan: 'Pencatatan temuan & ketidaksesuaian layanan',
}

// Info box setelah pilih
const INFO_BOX_CLASS = {
  daily_monitor: 'info-box--info',
  temuan: 'info-box--warning',
}

const INFO_BOX_TEXT = {
  daily_monitor:
    'Anda akan mengisi laporan pemantauan harian. Pastikan data yang diisi sesuai kondisi aktual di lapangan.',
  temuan:
    'Anda akan mencatat temuan. Isi setiap poin dengan jelas dan lengkap agar dapat ditindaklanjuti.',
}
</script>
