<template>
  <div class="min-h-screen bg-[var(--color-background)] flex items-start justify-center px-4 py-8">
    <div class="w-full max-w-3xl">
      <!-- ── Header Card ── -->
      <div class="card mb-6 overflow-hidden p-0">
        <div class="bg-gradient-to-r from-primary-700 to-primary px-6 py-5 flex items-center gap-4">
          <!-- <div
            class="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0"
          > -->
          <!-- <span class="material-icons text-white text-2xl">mosque</span> -->
          <img :src="logoURL" class="w-16 h-16" alt="Logo SiPanji" />
          <!-- </div> -->
          <div>
            <h1 class="text-xl font-bold text-white tracking-wide">SiPanji</h1>
            <p class="text-xs text-white/70 mt-0.5">Sistem Pengendalian Operasional Haji</p>
          </div>
          <!-- Badge tahun -->
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
            Step {{ store.currentStep + 1 }} / {{ MONITORING_STEPS.length }}
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
            :disabled="!canNavigateTo(index)"
            @click="store.goToStep(index)"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 shadow-sm"
              :class="bubbleClass(index)"
            >
              <span v-if="isCompleted(index)" class="material-icons text-base">check</span>
              <span v-else class="material-icons text-base">{{ step.icon }}</span>
            </div>
            <span
              class="hidden sm:block text-xs font-semibold transition-colors"
              :class="
                isCompleted(index) || isActive(index)
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
        <!-- Step title bar dalam card -->
        <div class="flex items-center gap-3 pb-4 mb-4 border-b border-[var(--color-surface-2)]">
          <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span class="material-icons text-white text-base">
              {{ MONITORING_STEPS[store.currentStep]?.icon }}
            </span>
          </div>
          <div>
            <p class="text-xs text-[var(--color-text-faint)] font-medium uppercase tracking-wide">
              Langkah {{ store.currentStep + 1 }}
            </p>
            <p class="text-sm font-semibold text-[var(--color-text)] leading-tight">
              {{ MONITORING_STEPS[store.currentStep]?.title }}
              <span class="text-[var(--color-text-muted)] font-normal">
                — {{ MONITORING_STEPS[store.currentStep]?.subtitle }}
              </span>
            </p>
          </div>
        </div>

        <Transition name="slide-fade" mode="out-in">
          <component :is="currentStepComponent" :key="store.currentStep" />
        </Transition>
      </div>

      <!-- ── Navigasi Bawah ── -->
      <div class="mt-5 flex justify-between items-center">
        <button v-if="store.currentStep > 0" class="btn btn-outline gap-2" @click="store.prevStep">
          <span class="material-icons text-base">arrow_back</span>
          Kembali
        </button>
        <div v-else />

        <button
          v-if="store.currentStep < 5"
          class="btn btn-primary gap-2"
          :disabled="!store.canProceed"
          @click="store.nextStep"
        >
          Lanjut
          <span class="material-icons text-base">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { MONITORING_STEPS } from '@/constants/monitoring'
import logoURL from '@/assets/logo.png'

const store = useMonitoringStore()

const stepComponents = [
  defineAsyncComponent(() => import('./Step1JenisPaket.vue')),
  defineAsyncComponent(() => import('./Step2Kontributor.vue')),
  defineAsyncComponent(() => import('./Step3LokasiMatriks.vue')),
  defineAsyncComponent(() => import('./Step4Provinsi.vue')),
  defineAsyncComponent(() => import('./Step5Embarkasi.vue')),
  defineAsyncComponent(() => import('./Step6Monev.vue')),
]

const currentStepComponent = computed(() => stepComponents[store.currentStep])

// Lebar garis progres (antara bubble pertama dan terakhir)
const progressLineWidth = computed(() => {
  if (MONITORING_STEPS.length <= 1) return '0%'
  const pct = (store.currentStep / (MONITORING_STEPS.length - 1)) * 100
  // Garis mulai dari bubble pertama (kira-kira 4% dari kiri)
  return `calc(${pct}% * (100% - 3rem) / 100%)`
})

const isCompleted = (index) => index < store.currentStep
const isActive = (index) => index === store.currentStep
const canNavigateTo = (index) => index <= store.currentStep

const bubbleClass = (index) => {
  if (isCompleted(index)) return 'bg-primary border-primary text-white'
  if (isActive(index)) return 'bg-white border-primary text-primary ring-4 ring-primary/10'
  return 'bg-white border-[var(--color-surface-2)] text-[var(--color-text-faint)]'
}

onMounted(() => {
  store.restoreFromLocalStorage()
})
</script>
