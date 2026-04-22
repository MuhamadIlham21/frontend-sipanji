<template>
  <div>
    <h2 class="text-lg font-semibold text-[var(--color-text)] mb-1">Monitoring & Evaluasi</h2>
    <p class="text-sm text-[var(--color-text-muted)] mb-5">
      Pilih aspek pengawasan, buka accordion, isi pertanyaan, lalu kirim.
    </p>

    <!-- ── Tab Pengawasan (scroll horizontal) ── -->
    <div class="relative mb-5">
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="tab in TAB_PENGAWASAN"
          :key="tab.id"
          class="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all duration-200 shrink-0"
          :class="
            store.formState.active_tab === tab.id
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-surface-2)] hover:border-primary hover:text-primary'
          "
          @click="store.setActiveTab(tab.id)"
        >
          <span class="material-icons text-sm">{{ tab.icon }}</span>
          {{ tab.shortLabel }}
        </button>
      </div>
      <!-- Fade kanan sebagai hint scroll -->
      <div
        class="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[var(--color-surface)] to-transparent pointer-events-none"
      />
    </div>

    <!-- ── Accordion List ── -->
    <div class="flex flex-col gap-3">
      <MonevAccordion
        v-for="accordion in accordionAktif"
        :key="accordion.id"
        :accordion="accordion"
      />
    </div>

    <!-- Empty state jika tidak ada accordion -->
    <div
      v-if="accordionAktif.length === 0"
      class="flex flex-col items-center justify-center gap-3 py-10 text-center"
    >
      <span class="material-icons text-4xl text-[var(--color-text-faint)]">assignment_late</span>
      <p class="text-sm text-[var(--color-text-muted)]">Tidak ada item pengawasan untuk tab ini.</p>
    </div>

    <!-- ── Success Modal ── -->
    <MonevSuccessModal
      v-model="store.showSuccessModal"
      :result="store.submitResult"
      @close="store.showSuccessModal = false"
      @reset="handleReset"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { TAB_PENGAWASAN, ACCORDION_PENGAWASAN } from '@/constants/monitoring'
import MonevAccordion from './MonevAccordion.vue'
import MonevSuccessModal from './MonevSuccessModal.vue'

const store = useMonitoringStore()

const accordionAktif = computed(() => ACCORDION_PENGAWASAN[store.formState.active_tab] || [])

const handleReset = () => {
  store.resetForm()
  store.showSuccessModal = false
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
