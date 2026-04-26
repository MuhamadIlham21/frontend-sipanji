<template>
  <!-- Backdrop dengan v-if langsung di sini -->
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-60 flex items-center justify-center px-4">
      <!-- Backdrop -->
      <Transition name="fade">
        <div
          v-if="modelValue"
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="$emit('close')"
        />
      </Transition>

      <!-- Modal -->
      <Transition name="slide-fade">
        <div
          v-if="modelValue"
          class="relative z-10 w-full max-w-sm card items-center text-center gap-5"
        >
          <!-- Accent bar atas -->
          <div class="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-[var(--color-accent)]" />

          <!-- Icon sukses -->
          <div
            class="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mt-2"
          >
            <span class="material-icons text-4xl" style="color: var(--color-success)"
              >check_circle</span
            >
          </div>

          <div>
            <h3 class="text-lg font-bold" style="color: var(--color-text)">Laporan Terkirim!</h3>
            <p class="text-sm mt-1" style="color: var(--color-text-muted)">
              Data monitoring pengawasan haji berhasil disimpan.
            </p>
          </div>

          <!-- Detail ringkasan -->
          <div
            v-if="result"
            class="w-full rounded-xl px-4 py-3 text-sm text-left flex flex-col gap-2"
            style="background: var(--color-surface-2)"
          >
            <div class="flex justify-between items-center">
              <span style="color: var(--color-text-faint)">ID Laporan</span>
              <span
                class="font-semibold font-mono text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary"
              >
                {{ result.id || '—' }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span style="color: var(--color-text-faint)">Waktu</span>
              <span class="font-semibold" style="color: var(--color-text)">{{ waktuKirim }}</span>
            </div>
          </div>

          <!-- Aksi -->
          <div class="flex flex-col gap-2 w-full">
            <button class="btn btn-primary w-full gap-2" @click="$emit('reset')">
              <span class="material-icons text-base">add_circle</span>
              Isi Laporan Baru
            </button>
            <button class="btn btn-outline w-full" @click="$emit('close')">Tutup</button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  result: { type: Object, default: null },
})

defineEmits(['close', 'reset'])

const waktuKirim = computed(() =>
  new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
)
</script>
