<template>
  <div class="min-h-screen bg-[var(--color-background)] flex items-start justify-center px-4 py-8">
    <div class="w-full max-w-3xl">
      <!-- ── Header Card ── -->
      <div class="card mb-6 overflow-hidden p-0">
        <div class="bg-gradient-to-r from-primary-700 to-primary px-6 py-5 flex items-center gap-4">
          <img :src="logoURL" class="w-16 h-16" alt="Logo SiPanji" />
          <div>
            <h1 class="text-xl font-bold text-white tracking-wide">SiPanji</h1>
            <p class="text-xs text-white/70 mt-0.5">Sistem Pengendalian Operasional Haji</p>
          </div>
          <div class="ml-auto">
            <span
              class="px-3 py-1 rounded-full bg-[var(--color-accent)] text-[var(--color-text)] text-xs font-bold shadow-sm"
            >
              1446 H
            </span>
          </div>
        </div>

        <!-- Sub-info strip -->
        <div
          class="px-6 py-3 bg-primary-50 border-t border-primary-100 flex items-center gap-2 text-xs text-[var(--color-text-muted)]"
        >
          <span class="material-icons text-sm text-primary">info</span>
          Isi formulir sesuai kondisi lapangan. Data akan tersimpan otomatis.
          <span class="ml-auto font-medium text-primary">
            Step {{ store.currentStep }} / {{ store.totalSteps }}
          </span>
        </div>
      </div>

      <!-- ── Stepper Progress ── -->
      <div class="card mb-6 py-5">
        <div class="flex items-center justify-between relative px-2">
          <!-- Garis background -->
          <div class="absolute top-5 left-6 right-6 h-0.5 bg-[var(--color-surface-2)] z-0" />
          <!-- Garis progres -->
          <div
            class="absolute top-5 left-6 h-0.5 bg-primary z-0 transition-all duration-500"
            :style="{ width: progressLineWidth }"
          />

          <button
            v-for="(step, index) in MONITORING_STEPS"
            :key="step.id"
            class="relative z-10 flex flex-col items-center gap-1.5 focus:outline-none disabled:cursor-default"
            :disabled="!canNavigateTo(step.id)"
            @click="canNavigateTo(step.id) && store.goToStep(step.id)"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm"
              :class="bubbleClass(step.id)"
            >
              <span v-if="isCompleted(step.id)" class="material-icons text-base">check</span>
              <span v-else class="material-icons text-base">{{ step.icon }}</span>
            </div>
            <span
              class="hidden sm:block text-xs font-semibold transition-colors"
              :class="
                isCompleted(step.id) || isActive(step.id)
                  ? 'text-primary'
                  : 'text-[var(--color-text-faint)]'
              "
            >
              {{ step.title }}
            </span>
          </button>
        </div>
      </div>

      <!-- ── Step Content Card ── -->
      <div class="card min-h-[360px]">
        <!-- Step title bar -->
        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-[var(--color-surface-2)]">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span class="material-icons text-white text-base">
              {{ currentStepMeta?.icon }}
            </span>
          </div>
          <div>
            <p class="text-xs text-[var(--color-text-faint)] font-medium uppercase tracking-wide">
              Langkah {{ store.currentStep }}
            </p>
            <p class="text-sm font-semibold text-[var(--color-text)] leading-tight">
              {{ currentStepMeta?.title }}
              <span class="text-[var(--color-text-muted)] font-normal">
                — {{ currentStepMeta?.subtitle }}
              </span>
            </p>
          </div>
        </div>

        <!-- Loading form data (fetch API pertama kali) -->
        <div v-if="store.isLoadingForm" class="flex flex-col gap-3">
          <div v-for="n in 3" :key="n" class="skeleton h-16 rounded-xl"></div>
        </div>

        <!-- Step Component -->
        <Transition v-else name="slide-fade" mode="out-in">
          <component :is="currentStepComponent" :key="store.currentStep" />
        </Transition>
      </div>

      <!-- Ganti bagian navigasi bawah -->
      <div class="mt-5 flex justify-between items-center">
        <button v-if="!store.isFirstStep" class="btn btn-outline gap-2" @click="store.prevStep">
          <span class="material-icons text-base">arrow_back</span>
          Kembali
        </button>
        <div v-else />

        <!-- Step 1–6: tombol Lanjut biasa -->
        <button
          v-if="!store.isLastStep"
          class="btn btn-primary gap-2"
          :disabled="!store.isCurrentStepValid"
          @click="store.nextStep"
        >
          Lanjut
          <span class="material-icons text-base">arrow_forward</span>
        </button>

        <button
          v-else-if="store.isLastStep"
          class="btn btn-primary gap-2"
          :disabled="store.isSubmitting || !store.activeSectionId"
          @click="handleFinalSubmit"
        >
          <span v-if="store.isSubmitting" class="material-icons text-base animate-spin"
            >autorenew</span
          >
          <span v-else class="material-icons text-base">send</span>
          {{ store.isSubmitting ? 'Mengirim...' : 'Kirim Laporan' }}
        </button>
      </div>

      <!-- Modal sukses -->
      <MonevSuccessModal
        :model-value="showSuccessModal"
        :result="store.submitResult"
        @close="showSuccessModal = false"
        @reset="handleReset"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineAsyncComponent, ref, watch } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { MONITORING_STEPS } from '@/constants/monitoring'
import logoURL from '@/assets/logo.png'
import MonevSuccessModal from './MonevSuccessModal.vue'

const store = useMonitoringStore()
const showSuccessModal = ref(false)

// ── Step Components (index 0 = step 1, dst) ──────────────────
// Urutan HARUS sama dengan MONITORING_STEPS (step.id 1–7)
const stepComponents = [
  defineAsyncComponent(() => import('./Step1JenisPaket.vue')),
  defineAsyncComponent(() => import('./Step2Kontributor.vue')),
  defineAsyncComponent(() => import('./Step3LokasiMatriks.vue')),
  defineAsyncComponent(() => import('./Step4Provinsi.vue')),
  defineAsyncComponent(() => import('./Step5Embarkasi.vue')),
  defineAsyncComponent(() => import('./Step6Tindakan.vue')), // baru
  defineAsyncComponent(() => import('./Step6Monev.vue')), // geser jadi index 6
]

// currentStep berbasis 1 → index array = currentStep - 1
const currentStepComponent = computed(() => stepComponents[store.currentStep - 1])

const currentStepMeta = computed(() => MONITORING_STEPS.find((s) => s.id === store.currentStep))

// ── Progress line width ───────────────────────────────────────
// currentStep berbasis 1, dari 1 s/d totalSteps
const progressLineWidth = computed(() => {
  if (store.totalSteps <= 1) return '0%'
  const pct = ((store.currentStep - 1) / (store.totalSteps - 1)) * 100
  return `${pct}%`
})

// ── Stepper helpers ───────────────────────────────────────────
// stepId = step.id (1-based)
const isCompleted = (stepId) => stepId < store.currentStep
const isActive = (stepId) => stepId === store.currentStep
const canNavigateTo = (stepId) => stepId <= store.currentStep

const bubbleClass = (stepId) => {
  if (isCompleted(stepId)) return 'bg-primary border-primary text-white'
  if (isActive(stepId)) return 'bg-white border-primary text-primary ring-4 ring-primary/10'
  return 'bg-white border-[var(--color-surface-2)] text-[var(--color-text-faint)]'
}

async function handleFinalSubmit() {
  alert('Submit Dalam Pengembangan')
  // try {
  //   await store.submitMonev()
  //   showSuccessModal.value = true
  // } catch {
  //   // error sudah di-handle di store
  // }
}

// ── Init ──────────────────────────────────────────────────────
onMounted(() => {
  store.restoreFromLocalStorage()
  store.fetchFormData()
})

const isAllComplete = computed(
  () =>
    store.monevTabs.length > 0 &&
    store.monevTabs.every((tab) => tab.sections.every((s) => store.isSectionSubmitted(s.id))),
)

// Handler reset — tutup modal + reset store
function handleReset() {
  showSuccessModal.value = false
  store.resetForm()
}
</script>
