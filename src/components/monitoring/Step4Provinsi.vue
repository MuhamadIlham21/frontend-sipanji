<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text)] mb-1">Provinsi Embarkasi</h2>
    <p class="text-sm text-[var(--color-text-muted)] mb-6">
      Pilih provinsi asal jemaah yang diawasi
    </p>

    <!-- Loading skeleton -->
    <div v-if="store.isLoading" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="n in 6"
        :key="n"
        class="h-12 rounded-2xl bg-[var(--color-surface-2)] animate-pulse"
      />
    </div>

    <!-- Grid pilihan provinsi -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <button
        v-for="provinsi in store.provinsiList"
        :key="provinsi.id"
        class="relative flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-medium text-left transition-all duration-200 focus:outline-none"
        :class="
          store.formState.provinsi_id === provinsi.id
            ? 'border-primary bg-primary-50 text-primary shadow-sm'
            : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-primary hover:bg-primary-50'
        "
        @click="pilihProvinsi(provinsi)"
      >
        <span
          class="material-icons text-base shrink-0"
          :class="
            store.formState.provinsi_id === provinsi.id
              ? 'text-primary'
              : 'text-[var(--color-text-faint)]'
          "
        >
          map
        </span>
        <span class="leading-tight">{{ provinsi.label }}</span>

        <!-- Checkmark -->
        <span
          v-if="store.formState.provinsi_id === provinsi.id"
          class="absolute top-2 right-2 material-icons text-primary text-sm"
        >
          check_circle
        </span>
      </button>
    </div>

    <!-- Error state -->
    <div
      v-if="store.isError && !store.isLoading"
      class="mt-4 flex items-center gap-2 text-sm text-[var(--color-error)]"
    >
      <span class="material-icons text-base">error_outline</span>
      Gagal memuat data provinsi.
      <button class="underline font-medium" @click="store.fetchProvinsi()">Coba lagi</button>
    </div>

    <!-- Info provinsi terpilih -->
    <Transition name="fade">
      <div
        v-if="store.formState.provinsi_label"
        class="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-[var(--color-text-muted)]"
      >
        <span class="material-icons text-primary text-base align-middle mr-1">check_circle</span>
        Provinsi terpilih:
        <span class="font-semibold text-primary">{{ store.formState.provinsi_label }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()

const pilihProvinsi = async (provinsi) => {
  // Jika memilih provinsi yang sama, abaikan
  if (store.formState.provinsi_id === provinsi.id) return

  store.setProvinsi(provinsi.id, provinsi.label)

  // Langsung fetch embarkasi agar Step 5 siap
  await store.fetchEmbarkasiByProvinsi(provinsi.id)
}

onMounted(() => {
  store.fetchProvinsi()
})
</script>
