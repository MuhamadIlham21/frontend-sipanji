<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Pilih Lokasi Pengawasan</h2>
      <p class="step-subtitle">Tentukan sektor dan lokasi pengawasan yang dituju</p>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoadingForm" class="flex flex-col gap-4 mt-4">
      <div class="skeleton h-12 rounded-lg"></div>
      <div class="skeleton h-12 rounded-lg"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="store.formLoadError" class="error-state">
      <span class="material-icons text-[var(--color-error)] text-3xl">error_outline</span>
      <p class="text-sm text-[var(--color-error)] mt-2">{{ store.formLoadError }}</p>
      <button class="btn-secondary mt-3" @click="store.fetchFormData()">Coba Lagi</button>
    </div>

    <div v-else class="flex flex-col gap-5 mt-4">
      <!-- Dropdown 1 — Sektor Pengawasan -->
      <div class="form-group">
        <label class="form-label">
          Sektor Pengawasan
          <span class="text-[var(--color-error)]">*</span>
        </label>
        <div class="select-wrapper">
          <select
            class="input-field"
            :value="store.formState.sektor_id"
            @change="onSektorChange($event.target.value)"
          >
            <option value="" disabled>-- Pilih Sektor --</option>
            <option v-for="opt in store.sektorOptions" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>
          <span class="material-icons select-icon">expand_more</span>
        </div>

        <!-- Preview pilihan sektor -->
        <div v-if="store.formState.sektor_label" class="selected-preview mt-2">
          <span class="material-icons text-sm text-[var(--color-primary)]">location_on</span>
          <span class="text-sm text-[var(--color-text-muted)]">
            Dipilih:
            <strong class="text-[var(--color-text)]">{{ store.formState.sektor_label }}</strong>
          </span>
        </div>
      </div>

      <!-- Dropdown 2 — Lokasi Pengawasan -->
      <div class="form-group">
        <label class="form-label">
          Lokasi Pengawasan
          <span class="text-[var(--color-error)]">*</span>
        </label>
        <div class="select-wrapper">
          <select
            class="input-field"
            :value="store.formState.lokasi_id"
            @change="onLokasiChange($event.target.value)"
          >
            <option value="" disabled>-- Pilih Lokasi --</option>
            <option v-for="opt in store.lokasiOptions" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>
          <span class="material-icons select-icon">expand_more</span>
        </div>

        <!-- Preview pilihan lokasi -->
        <div v-if="store.formState.lokasi_label" class="selected-preview mt-2">
          <span class="material-icons text-sm text-[var(--color-primary)]">business</span>
          <span class="text-sm text-[var(--color-text-muted)]">
            Dipilih:
            <strong class="text-[var(--color-text)]">{{ store.formState.lokasi_label }}</strong>
          </span>
        </div>
      </div>

      <!-- Ringkasan pilihan (muncul jika keduanya sudah dipilih) -->
      <Transition name="fade">
        <div v-if="store.formState.sektor_id && store.formState.lokasi_id" class="summary-card">
          <span class="material-icons text-[var(--color-primary)] text-xl">check_circle</span>
          <div class="flex flex-col gap-0.5">
            <p class="text-xs text-[var(--color-text-muted)]">Lokasi pengawasan dipilih</p>
            <p class="text-sm font-semibold text-[var(--color-text)]">
              {{ store.formState.sektor_label }}
            </p>
            <p class="text-xs text-[var(--color-text-muted)]">
              {{ store.formState.lokasi_label }}
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()

function onSektorChange(selectedId) {
  const option = store.sektorOptions.find((o) => o.id === selectedId)
  if (option) store.setSektor(option)
}

function onLokasiChange(selectedId) {
  const option = store.lokasiOptions.find((o) => o.id === selectedId)
  if (option) store.setLokasi(option)
}
</script>
