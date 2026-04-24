<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Pilih Provinsi</h2>
      <p class="step-subtitle">Pilih provinsi asal jemaah yang diawasi</p>
    </div>

    <!-- Loading -->
    <div v-if="store.isLoadingForm" class="flex flex-col gap-3 mt-4">
      <div class="skeleton h-12 rounded-full"></div>
    </div>

    <!-- Error -->
    <div v-else-if="store.formLoadError" class="error-state">
      <span class="material-icons text-[var(--color-error)] text-3xl">error_outline</span>
      <p class="text-sm text-[var(--color-error)] mt-2">{{ store.formLoadError }}</p>
      <button class="btn-secondary mt-3" @click="store.fetchFormData()">Coba Lagi</button>
    </div>

    <div v-else class="flex flex-col gap-4 mt-4">

      <!-- Search -->
      <div class="search-wrapper">
        <span class="material-icons search-icon">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari provinsi..."
          class="input-field pl-9"
        />
      </div>

      <!-- Dropdown -->
      <div class="form-group">
        <label class="form-label">
          Provinsi <span class="text-[var(--color-error)]">*</span>
        </label>
        <div class="select-wrapper">
          <select
            class="input-field"
            :value="store.formState.provinsi_value"
            @change="onProvinsiChange($event.target.value)"
          >
            <option value="" disabled>-- Pilih Provinsi --</option>
            <option
              v-for="opt in filteredProvinsi"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <span class="material-icons select-icon">expand_more</span>
        </div>
        <p
          v-if="searchQuery && filteredProvinsi.length === 0"
          class="text-xs text-[var(--color-text-muted)] mt-1"
        >
          Provinsi "{{ searchQuery }}" tidak ditemukan
        </p>
      </div>

      <!-- Preview -->
      <Transition name="fade">
        <div v-if="store.formState.provinsi_label" class="summary-card">
          <span class="material-icons text-[var(--color-primary)] text-xl">map</span>
          <div class="flex flex-col gap-0.5">
            <p class="text-xs text-[var(--color-text-muted)]">Provinsi dipilih</p>
            <p class="text-sm font-semibold text-[var(--color-text)]">
              {{ store.formState.provinsi_label }}
            </p>
            <p class="text-xs text-[var(--color-text-muted)]">
              Lanjut ke langkah berikutnya untuk memilih embarkasi
            </p>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()
const searchQuery = ref('')

const filteredProvinsi = computed(() => {
  if (!searchQuery.value.trim()) return store.provinsiOptions
  const q = searchQuery.value.toLowerCase()
  return store.provinsiOptions.filter((o) => o.label.toLowerCase().includes(q))
})

function onProvinsiChange(selectedValue) {
  const option = store.provinsiOptions.find((o) => o.value === selectedValue)
  if (option) store.setProvinsi(option)
  // store.setProvinsi sudah handle: reset embarkasi + fetch embarkasi baru
}
</script>