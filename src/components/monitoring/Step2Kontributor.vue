<template>
  <div class="step-container">
    <h2 class="text-lg font-semibold text-[var(--color-text)] mb-1">Identitas Kontributor</h2>
    <p class="text-sm text-[var(--color-text-muted)] mb-6">
      Siapa yang mengisi laporan pengawasan ini?
    </p>

    <!-- Loading -->
    <div v-if="store.isLoadingForm" class="flex flex-wrap gap-2 mb-4">
      <div v-for="n in 3" :key="n" class="skeleton h-9 w-24 rounded-full"></div>
    </div>

    <!-- Jenis Kontributor — pill button (UI lama) -->
    <div v-else class="form-group mb-2">
      <label class="text-sm font-medium text-[var(--color-text)]">Jenis Kontributor</label>
      <div class="flex flex-wrap gap-2 mt-1">
        <button
          v-for="item in store.kontributorOptions"
          :key="item.id"
          type="button"
          class="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
          :class="
            store.formState.kontributor_id === item.id
              ? 'bg-primary border-primary text-white shadow-sm'
              : 'bg-[var(--color-surface)] border-[var(--color-text-faint)] text-[var(--color-text-muted)] hover:border-primary hover:text-primary'
          "
          @click="store.setKontributor(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <!-- Input Lainnya — muncul jika pilih 'lainnya' -->
    <Transition name="fade">
      <div v-if="store.formState.kontributor_value === 'lainnya'" class="form-group mb-2">
        <label class="text-sm font-medium text-[var(--color-text)]">
          Sebutkan jenis kontributor
        </label>
        <input
          type="text"
          :value="store.formState.kontributor_lainnya"
          placeholder="Contoh: Relawan, Dokter, ..."
          class="input-field"
          @input="store.setKontributorLainnya($event.target.value)"
        />
      </div>
    </Transition>

    <!-- Nama Lengkap -->
    <div class="form-group mt-2">
      <label class="text-sm font-medium text-[var(--color-text)]">Nama Lengkap</label>
      <input
        type="text"
        :value="store.formState.nama_lengkap"
        placeholder="Masukkan nama lengkap Anda"
        class="input-field"
        @input="store.setNamaLengkap($event.target.value)"
      />
      <p
        v-if="
          store.formState.nama_lengkap.length > 0 && store.formState.nama_lengkap.trim().length < 3
        "
        class="text-xs text-[var(--color-error)]"
      >
        Nama minimal 3 karakter
      </p>
    </div>

    <!-- NIP / NIK / No. Porsi -->
    <div class="form-group mt-4">
      <label class="text-sm font-medium text-[var(--color-text)]"> NIP / NIK / No. Porsi </label>
      <input
        type="text"
        :value="store.formState.identitas"
        placeholder="Masukkan NIP / NIK / No. Porsi"
        class="input-field"
        @input="store.setIdentitas($event.target.value)"
      />
      <p
        v-if="store.formState.identitas.length > 0 && store.formState.identitas.trim().length < 6"
        class="text-xs text-[var(--color-error)]"
      >
        Minimal 6 karakter
      </p>
      <p class="text-xs text-[var(--color-text-muted)]">
        Isi salah satu: NIP (pegawai), NIK (masyarakat), atau nomor porsi haji
      </p>
    </div>

    <!-- Preview ringkasan -->
    <Transition name="fade">
      <div
        v-if="store.formState.kontributor_id && store.formState.nama_lengkap?.trim().length >= 3"
        class="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-[var(--color-text-muted)]"
      >
        <span class="material-icons text-primary text-base align-middle mr-1">person_check</span>
        Laporan ini diisi oleh
        <span class="font-semibold text-primary">{{ store.formState.nama_lengkap }}</span>
        ({{ store.formState.identitas }}) sebagai
        <span class="font-semibold text-primary">{{ labelKontributor }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'

const store = useMonitoringStore()

const labelKontributor = computed(() => {
  if (store.formState.kontributor_value === 'lainnya') {
    return store.formState.kontributor_lainnya || 'Lainnya'
  }
  return store.formState.kontributor_label || ''
})
</script>
