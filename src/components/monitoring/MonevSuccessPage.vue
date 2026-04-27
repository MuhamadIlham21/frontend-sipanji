<template>
  <div class="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <div class="card flex flex-col items-center text-center gap-5 py-10 px-6">
        <!-- Icon -->
        <div
          class="w-20 h-20 rounded-full bg-[var(--color-success-highlight)] flex items-center justify-center"
        >
          <span class="material-icons text-[var(--color-success)] text-5xl">check_circle</span>
        </div>

        <!-- Judul -->
        <div class="flex flex-col gap-1.5">
          <h1 class="text-xl font-bold text-[var(--color-text)]">Terima Kasih!</h1>
          <p class="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Laporan pengawasan Anda telah berhasil dikirim.<br />
            Laporan Anda sangat berarti untuk meningkatkan kualitas penyelenggaraan ibadah haji
            Indonesia.
          </p>
        </div>

        <!-- Nomor Tiket -->
        <div
          class="w-full bg-[var(--color-surface-2)] border border-[var(--color-surface-2)] rounded-xl px-4 py-3 flex flex-col gap-1"
        >
          <p class="text-xs text-[var(--color-text-muted)] uppercase tracking-wide font-medium">
            Nomor Tiket
          </p>
          <div class="flex items-center justify-between gap-2">
            <p class="text-sm font-mono font-semibold text-[var(--color-primary)] break-all">
              {{ ticketNo ?? '-' }}
            </p>
            <button
              type="button"
              class="shrink-0"
              :title="copied ? 'Tersalin!' : 'Salin nomor tiket'"
              @click="copyTicket"
            >
              <span
                class="material-icons text-base"
                :class="copied ? 'text-[var(--color-success)]' : 'text-[var(--color-text-faint)]'"
              >
                {{ copied ? 'check' : 'content_copy' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Info simpan -->
        <p class="text-xs text-[var(--color-text-faint)] flex items-center gap-1">
          <span class="material-icons text-sm">info</span>
          Simpan nomor tiket sebagai bukti pengisian.
        </p>

        <!-- Tombol -->
        <button type="button" class="btn btn-primary w-full gap-2 mt-2" @click="emit('reset')">
          <span class="material-icons text-base">refresh</span>
          Isi Laporan Baru
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  ticketNo: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['reset'])

const copied = ref(false)

function copyTicket() {
  if (!props.ticketNo) return
  navigator.clipboard.writeText(props.ticketNo).then(() => {
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  })
}
</script>
