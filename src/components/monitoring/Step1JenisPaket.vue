<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text)] mb-1">Jenis Paket Haji</h2>
    <p class="text-sm text-[var(--color-text-muted)] mb-6">
      Pilih jenis paket haji yang akan diawasi
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        v-for="paket in JENIS_PAKET"
        :key="paket.value"
        class="relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 focus:outline-none"
        :class="
          selected === paket.value
            ? 'border-primary bg-primary-50 shadow-sm'
            : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] hover:border-primary'
        "
        @click="store.setJenisPaket(paket.value)"
      >
        <!-- Icon -->
        <div
          class="w-14 h-14 rounded-xl flex items-center justify-center transition-colors"
          :class="
            selected === paket.value
              ? 'bg-primary text-white'
              : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
          "
        >
          <span class="material-icons text-3xl">
            {{ paket.value === 'reguler' ? 'people' : 'star' }}
          </span>
        </div>

        <span
          class="text-base font-semibold"
          :class="selected === paket.value ? 'text-primary' : 'text-[var(--color-text)]'"
        >
          {{ paket.label }}
        </span>

        <span class="text-xs text-[var(--color-text-faint)] text-center">
          {{
            paket.value === 'reguler'
              ? 'Jemaah haji program reguler pemerintah'
              : 'Jemaah haji program khusus / ONH plus'
          }}
        </span>

        <!-- Checkmark pojok kanan atas -->
        <div
          v-if="selected === paket.value"
          class="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
        >
          <span class="material-icons text-white text-xs">check</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { JENIS_PAKET } from '@/constants/monitoring'

const store = useMonitoringStore()
const selected = computed(() => store.formState.jenis_paket)
</script>
