<template>
  <div class="step-container">
    <!-- Loading -->
    <div v-if="store.isLoadingMonev" class="flex flex-col gap-3">
      <div class="skeleton h-10 rounded-xl w-2/3"></div>
      <div class="flex gap-2 mt-1">
        <div v-for="n in 4" :key="n" class="skeleton h-9 rounded-full w-24"></div>
      </div>
      <div class="flex flex-col gap-3 mt-4">
        <div v-for="n in 3" :key="n" class="skeleton h-14 rounded-xl"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="store.monevLoadError" class="error-state">
      <span class="material-icons text-[var(--color-error)] text-3xl">error_outline</span>
      <p class="text-sm text-[var(--color-error)] mt-2">{{ store.monevLoadError }}</p>
      <button class="btn-secondary mt-3" @click="store.fetchMonevData()">Coba Lagi</button>
    </div>

    <!-- Empty (tindakan belum dipilih) -->
    <div v-else-if="store.monevTabs.length === 0" class="error-state">
      <span class="material-icons text-[var(--color-text-faint)] text-4xl">assignment</span>
      <p class="text-sm text-[var(--color-text-muted)] mt-3 text-center">
        Belum ada data pengawasan.<br />Pastikan tindakan sudah dipilih.
      </p>
      <button class="btn-outline mt-4" @click="store.fetchMonevData()">Muat Ulang</button>
    </div>

    <div v-else>
      <!-- Header info tindakan -->
      <div class="info-box info-box--info mb-5">
        <span class="material-icons text-xl shrink-0">assignment_turned_in</span>
        <div class="flex flex-col gap-0.5">
          <p class="text-xs text-[var(--color-text-muted)]">Tindakan dipilih</p>
          <p class="text-sm font-semibold">{{ store.formState.tindakan_label }}</p>
        </div>
      </div>

      <!-- Tab navigation -->
      <div class="monev-tabs-wrapper mb-5">
        <div class="monev-tabs-scroll">
          <button
            v-for="tab in store.monevTabs"
            :key="tab.id"
            type="button"
            class="monev-tab"
            :class="{ active: activeTabId === tab.id }"
            @click="activeTabId = tab.id"
          >
            <span class="truncate max-w-[140px]">{{ tab.label }}</span>
            <!-- Badge: jumlah section selesai -->
            <span v-if="tabSubmittedCount(tab) > 0" class="monev-tab-badge">
              {{ tabSubmittedCount(tab) }}/{{ tab.sections.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <Transition name="slide-fade" mode="out-in">
        <div v-if="activeTab" :key="activeTabId" class="flex flex-col gap-2">
          <!-- Progress bar section -->
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-[var(--color-text-muted)]">
              {{ activeTab.label }}
            </p>
            <p class="text-xs font-semibold text-[var(--color-primary)]">
              {{ tabSubmittedCount(activeTab) }} / {{ activeTab.sections.length }} selesai
            </p>
          </div>

          <!-- Progress track -->
          <div class="h-1.5 bg-[var(--color-surface-2)] rounded-full mb-4 overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-500"
              :style="{ width: `${tabProgressPct(activeTab)}%` }"
            />
          </div>

          <!-- Accordion per section -->
          <MonevAccordion
            v-for="(section, index) in activeTab.sections"
            :key="section.id"
            :section="section"
            :default-open="index === firstUnsubmittedIndex"
          />

          <!-- Tab selesai semua -->
          <Transition name="fade">
            <div v-if="isTabComplete(activeTab)" class="tab-complete-banner mt-4">
              <span class="material-icons text-[var(--color-success)] text-2xl"> task_alt </span>
              <div>
                <p class="text-sm font-semibold text-[var(--color-success)]">
                  Semua bagian pada tab ini selesai!
                </p>
                <p class="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Lanjut ke tab berikutnya atau selesaikan semua tab.
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Semua tab selesai -->
      <Transition name="fade">
        <div v-if="isAllComplete" class="all-complete-banner mt-6">
          <span class="material-icons text-white text-3xl">celebration</span>
          <div>
            <p class="text-base font-bold text-white">Pengawasan Selesai!</p>
            <p class="text-sm text-white/80 mt-0.5">
              Semua data pengawasan telah berhasil disimpan.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import MonevAccordion from './MonevAccordion.vue'

const store = useMonitoringStore()

// ── Active tab ─────────────────────────────────────────────────
const activeTabId = ref('')

// Set tab pertama saat data tersedia
watch(
  () => store.monevTabs,
  (tabs) => {
    if (tabs.length > 0 && !activeTabId.value) {
      activeTabId.value = tabs[0].id
    }
  },
  { immediate: true },
)

const activeTab = computed(() => store.monevTabs.find((t) => t.id === activeTabId.value) || null)

// ── Progress helpers ───────────────────────────────────────────
const tabSubmittedCount = (tab) => tab.sections.filter((s) => store.isSectionSubmitted(s.id)).length

const tabProgressPct = (tab) =>
  tab.sections.length === 0 ? 0 : Math.round((tabSubmittedCount(tab) / tab.sections.length) * 100)

const isTabComplete = (tab) =>
  tab.sections.length > 0 && tabSubmittedCount(tab) === tab.sections.length

const isAllComplete = computed(
  () => store.monevTabs.length > 0 && store.monevTabs.every((tab) => isTabComplete(tab)),
)

// Index section pertama yang belum di-submit → default open
const firstUnsubmittedIndex = computed(() => {
  if (!activeTab.value) return 0
  const idx = activeTab.value.sections.findIndex((s) => !store.isSectionSubmitted(s.id))
  return idx === -1 ? 0 : idx
})

// ── Fetch on mount ─────────────────────────────────────────────
onMounted(() => {
  store.fetchMonevData()
})
</script>
