<template>
  <div
    class="rounded-2xl border transition-all duration-200"
    :class="isOpen ? 'border-primary shadow-sm' : 'border-[var(--color-surface-2)]'"
  >
    <!-- ── Header Accordion ── -->
    <button
      class="w-full flex items-center justify-between gap-3 px-5 py-4 text-left focus:outline-none rounded-2xl transition-colors"
      :class="isOpen ? 'bg-primary-50' : 'bg-[var(--color-surface)] hover:bg-primary-50'"
      @click="store.setActiveAccordion(accordion.id)"
    >
      <!-- Nomor + Label -->
      <div class="flex items-center gap-3">
        <span
          class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          :class="
            isOpen
              ? 'bg-primary text-white'
              : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'
          "
        >
          {{ accordion.id.split('.').pop() }}
        </span>
        <span
          class="text-sm font-medium leading-snug"
          :class="isOpen ? 'text-primary' : 'text-[var(--color-text)]'"
        >
          {{ accordion.label }}
        </span>
      </div>

      <!-- Status badge + chevron -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Badge: sudah diisi -->
        <span
          v-if="sudahDiisi"
          class="hidden sm:flex items-center gap-1 text-xs font-medium text-[var(--color-success)] bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"
        >
          <span class="material-icons text-xs">check_circle</span>
          Terisi
        </span>
        <span
          class="material-icons text-[var(--color-text-faint)] transition-transform duration-300"
          :class="isOpen ? 'rotate-180' : ''"
        >
          expand_more
        </span>
      </div>
    </button>

    <!-- ── Body Accordion ── -->
    <Transition name="slide">
      <div v-if="isOpen" class="px-5 pb-5 pt-2">
        <!-- Loading pertanyaan -->
        <div v-if="store.isLoadingQuestions" class="flex flex-col gap-3 mt-3">
          <div
            v-for="n in 3"
            :key="n"
            class="h-10 rounded-xl bg-[var(--color-surface-2)] animate-pulse"
          />
        </div>

        <!-- Pertanyaan -->
        <div v-else-if="store.activeQuestions.length > 0" class="flex flex-col gap-6 mt-4">
          <MonevQuestionRenderer
            v-if="store.activeQuestions.length > 0"
            :questions="store.activeQuestions"
            :accordion-id="accordion.id"
          />
        </div>

        <!-- Empty -->
        <div v-else class="py-6 text-center text-sm text-[var(--color-text-faint)]">
          Tidak ada pertanyaan untuk item ini.
        </div>

        <!-- ── Tombol Submit ── -->
        <div
          v-if="store.activeQuestions.length > 0 && !store.isLoadingQuestions"
          class="mt-6 pt-4 border-t border-[var(--color-surface-2)] flex justify-end"
        >
          <button class="btn btn-primary gap-2" :disabled="store.isLoading" @click="handleSubmit">
            <span v-if="store.isLoading" class="material-icons animate-spin text-base">sync</span>
            <span v-else class="material-icons text-base">send</span>
            {{ store.isLoading ? 'Mengirim...' : 'Kirim Laporan' }}
          </button>
        </div>

        <!-- Error submit -->
        <Transition name="fade">
          <div
            v-if="store.isError && store.errorMessage"
            class="mt-3 flex items-center gap-2 text-sm text-[var(--color-error)] bg-red-50 border border-red-200 rounded-xl px-4 py-3"
          >
            <span class="material-icons text-base shrink-0">error_outline</span>
            {{ store.errorMessage }}
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import MonevQuestionRenderer from './MonevQuestionRenderer.vue'

const props = defineProps({
  accordion: {
    type: Object,
    required: true,
  },
})

const store = useMonitoringStore()

const isOpen = computed(() => store.formState.active_accordion === props.accordion.id)

// Cek apakah accordion ini sudah ada jawaban tersimpan
const sudahDiisi = computed(() => {
  const data = store.formState.monev_answers[props.accordion.id]
  if (!data) return false
  return Object.keys(data.answers || {}).length > 0
})

const handleSubmit = async () => {
  try {
    await store.submitMonev()
  } catch {
    // Error sudah ditangani di store (store.errorMessage)
  }
}
</script>
