<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text)] mb-1">Kota Embarkasi</h2>
    <p class="text-sm text-[var(--color-text-muted)] mb-1">
      Pilih kota embarkasi keberangkatan jemaah
    </p>

    <!-- Info provinsi terpilih (konteks) -->
    <div class="mb-5 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
      <span class="material-icons text-sm text-primary">map</span>
      Provinsi:
      <span class="font-semibold text-primary">{{ store.formState.provinsi_label }}</span>
      <button
        class="ml-1 text-[var(--color-text-faint)] hover:text-primary transition-colors text-xs underline"
        @click="store.prevStep()"
      >
        Ubah
      </button>
    </div>

    <!-- Loading skeleton -->
    <div v-if="store.isLoading" class="flex flex-col gap-3">
      <div
        v-for="n in 3"
        :key="n"
        class="h-14 rounded-2xl bg-[var(--color-surface-2)] animate-pulse"
      />
    </div>

    <!-- Daftar embarkasi -->
    <div v-else-if="store.embarkasi_list.length > 0" class="flex flex-col gap-3">
      <button
        v-for="embarkasi in store.embarkasi_list"
        :key="embarkasi.id"
        class="flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-sm text-left transition-all duration-200 focus:outline-none"
        :class="
          store.formState.embarkasi_id === embarkasi.id
            ? 'border-primary bg-primary-50 shadow-sm'
            : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] hover:border-primary hover:bg-primary-50'
        "
        @click="store.setEmbarkasi(embarkasi.id, embarkasi.label)"
      >
        <!-- Radio visual -->
        <span
          class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
          :class="
            store.formState.embarkasi_id === embarkasi.id
              ? 'border-primary bg-primary'
              : 'border-[var(--color-text-faint)] bg-white'
          "
        >
          <span
            v-if="store.formState.embarkasi_id === embarkasi.id"
            class="w-2 h-2 rounded-full bg-white"
          />
        </span>

        <!-- Label -->
        <div class="flex flex-col">
          <span
            class="font-semibold leading-tight"
            :class="
              store.formState.embarkasi_id === embarkasi.id
                ? 'text-primary'
                : 'text-[var(--color-text)]'
            "
          >
            {{ embarkasi.label }}
          </span>
          <!-- Kode embarkasi sebagai sub-label -->
          <span class="text-xs text-[var(--color-text-faint)] uppercase tracking-wide mt-0.5">
            Kode: {{ embarkasi.id.toUpperCase() }}
          </span>
        </div>

        <!-- Icon kanan jika terpilih -->
        <span
          v-if="store.formState.embarkasi_id === embarkasi.id"
          class="ml-auto material-icons text-primary text-lg"
        >
          flight_takeoff
        </span>
      </button>
    </div>

    <!-- Empty state: tidak ada embarkasi untuk provinsi ini -->
    <div
      v-else-if="!store.isLoading"
      class="flex flex-col items-center justify-center gap-3 py-10 text-center"
    >
      <span class="material-icons text-4xl text-[var(--color-text-faint)]">flight_off</span>
      <p class="text-sm text-[var(--color-text-muted)]">Tidak ada embarkasi untuk provinsi ini.</p>
      <button class="btn btn-outline text-sm px-4 py-2" @click="store.prevStep()">
        <span class="material-icons text-base mr-1">arrow_back</span>
        Pilih Provinsi Lain
      </button>
    </div>

    <!-- Error state -->
    <div
      v-if="store.isError && !store.isLoading"
      class="mt-4 flex items-center gap-2 text-sm text-[var(--color-error)]"
    >
      <span class="material-icons text-base">error_outline</span>
      Gagal memuat data embarkasi.
      <button
        class="underline font-medium"
        @click="store.fetchEmbarkasiByProvinsi(store.formState.provinsi_id)"
      >
        Coba lagi
      </button>
    </div>

    <!-- Info terpilih -->
    <Transition name="fade">
      <div
        v-if="store.formState.embarkasi_label"
        class="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-[var(--color-text-muted)]"
      >
        <span class="material-icons text-primary text-base align-middle mr-1">flight_takeoff</span>
        Embarkasi terpilih:
        <span class="font-semibold text-primary">{{ store.formState.embarkasi_label }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()

onMounted(async () => {
  // Jika embarkasi list kosong tapi provinsi sudah dipilih
  // (misal refresh halaman, data di-restore dari localStorage)
  if (store.embarkasi_list.length === 0 && store.formState.provinsi_id) {
    await store.fetchEmbarkasiByProvinsi(store.formState.provinsi_id)
  }
})
</script>
