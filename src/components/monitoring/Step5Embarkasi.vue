<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Pilih Embarkasi</h2>
      <p class="step-subtitle">Pilih kota embarkasi keberangkatan jemaah</p>
    </div>

    <!-- Provinsi belum dipilih -->
    <div v-if="!store.formState.provinsi_value" class="empty-step mt-6">
      <span class="material-icons text-[var(--color-text-faint)] text-4xl">flight_takeoff</span>
      <p class="text-sm text-[var(--color-text-muted)] mt-3 text-center">
        Pilih provinsi terlebih dahulu<br />
        untuk menampilkan daftar embarkasi
      </p>
      <button class="btn-outline mt-4 gap-2" @click="store.prevStep()">
        <span class="material-icons text-base">arrow_back</span>
        Kembali ke Provinsi
      </button>
    </div>

    <div v-else class="flex flex-col gap-4 mt-4">

      <!-- Info provinsi terpilih -->
      <div class="info-box info-box--info">
        <span class="material-icons text-xl shrink-0">map</span>
        <p class="text-sm">
          Menampilkan embarkasi untuk provinsi
          <strong>{{ store.formState.provinsi_label }}</strong>
        </p>
      </div>

      <!-- Loading embarkasi -->
      <div v-if="store.isLoadingEmb" class="flex flex-col gap-3">
        <div class="skeleton h-12 rounded-full"></div>
        <p class="text-xs text-[var(--color-text-muted)] text-center">
          Memuat daftar embarkasi...
        </p>
      </div>

      <!-- Embarkasi kosong (provinsi valid tapi tidak ada data) -->
      <div
        v-else-if="!store.isLoadingEmb && store.embarkasiOptions.length === 0"
        class="error-state"
      >
        <span class="material-icons text-[var(--color-text-faint)] text-3xl">
          flight_takeoff
        </span>
        <p class="text-sm text-[var(--color-text-muted)] mt-2 text-center">
          Tidak ada embarkasi tersedia untuk provinsi ini
        </p>
        <button
          class="btn-secondary mt-3"
          @click="store.fetchEmbarkasi(store.formState.provinsi_value)"
        >
          Coba Lagi
        </button>
      </div>

      <!-- Dropdown Embarkasi -->
      <div v-else class="form-group">
        <label class="form-label">
          Kota Embarkasi <span class="text-[var(--color-error)]">*</span>
        </label>

        <!-- Langsung render sebagai radio card jika <= 4 opsi -->
        <div
          v-if="store.embarkasiOptions.length <= 4"
          class="grid grid-cols-1 gap-2 mt-1"
        >
          <button
            v-for="opt in store.embarkasiOptions"
            :key="opt.value"
            type="button"
            class="radio-card"
            :class="{ active: store.formState.embarkasi_value === opt.value }"
            @click="store.setEmbarkasi(opt)"
          >
            <span class="material-icons radio-card-icon">flight_takeoff</span>
            <div class="radio-card-content">
              <span class="radio-card-label">{{ opt.label }}</span>
            </div>
            <span
              class="material-icons radio-card-check"
              :class="store.formState.embarkasi_value === opt.value ? 'opacity-100' : 'opacity-0'"
            >
              check_circle
            </span>
          </button>
        </div>

        <!-- Dropdown jika > 4 opsi -->
        <div v-else class="select-wrapper mt-1">
          <select
            class="input-field"
            :value="store.formState.embarkasi_value"
            @change="onEmbarkasiChange($event.target.value)"
          >
            <option value="" disabled>-- Pilih Embarkasi --</option>
            <option
              v-for="opt in store.embarkasiOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
          <span class="material-icons select-icon">expand_more</span>
        </div>
      </div>

      <!-- Preview pilihan -->
      <Transition name="fade">
        <div v-if="store.formState.embarkasi_label" class="summary-card">
          <span class="material-icons text-[var(--color-primary)] text-xl">flight_takeoff</span>
          <div class="flex flex-col gap-0.5">
            <p class="text-xs text-[var(--color-text-muted)]">Embarkasi dipilih</p>
            <p class="text-sm font-semibold text-[var(--color-text)]">
              {{ store.formState.embarkasi_label }}
            </p>
            <p class="text-xs text-[var(--color-text-muted)]">
              {{ store.formState.provinsi_label }}
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

function onEmbarkasiChange(selectedValue) {
  const option = store.embarkasiOptions.find((o) => o.value === selectedValue)
  if (option) store.setEmbarkasi(option)
}
</script>