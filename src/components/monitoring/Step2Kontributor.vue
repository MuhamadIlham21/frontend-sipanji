<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text)] mb-1">Identitas Kontributor</h2>
    <p class="text-sm text-[var(--color-text-muted)] mb-6">
      Siapa yang mengisi laporan pengawasan ini?
    </p>

    <!-- Jenis Kontributor -->
    <div class="form-group mb-2">
      <label class="text-sm font-medium text-[var(--color-text)]">Jenis Kontributor</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in JENIS_KONTRIBUTOR"
          :key="item.value"
          class="px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200"
          :class="
            store.formState.jenis_kontributor === item.value
              ? 'bg-primary border-primary text-white shadow-sm'
              : 'bg-[var(--color-surface)] border-[var(--color-text-faint)] text-[var(--color-text-muted)] hover:border-primary hover:text-primary'
          "
          @click="store.setKontributor(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <!-- Input Lainnya -->
    <Transition name="fade">
      <div v-if="store.formState.jenis_kontributor === 'lainnya'" class="form-group mb-2">
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
    <div class="form-group">
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

    <!-- NIP / NIK / Porsi -->
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
        v-if="store.formState.jenis_kontributor && store.formState.nama_lengkap.trim().length >= 3"
        class="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-[var(--color-text-muted)]"
      >
        <span class="material-icons text-primary text-base align-middle mr-1">person_check</span>
        Laporan ini diisi oleh
        <span class="font-semibold text-primary">
          {{ store.formState.nama_lengkap }}
        </span>
        ({{ store.formState.identitas }}) sebagai
        <span class="font-semibold text-primary">
          {{ labelKontributor }}
        </span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { JENIS_KONTRIBUTOR } from '@/constants/monitoring'

const store = useMonitoringStore()

const labelKontributor = computed(() => {
  if (store.formState.jenis_kontributor === 'lainnya') {
    return store.formState.kontributor_lainnya || 'Lainnya'
  }
  return JENIS_KONTRIBUTOR.find((k) => k.value === store.formState.jenis_kontributor)?.label || ''
})
</script>
