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
      <button class="btn btn-outline mt-3" @click="store.fetchMonevData()">Coba Lagi</button>
    </div>

    <!-- Empty -->
    <div v-else-if="store.monevTabs.length === 0" class="error-state">
      <span class="material-icons text-[var(--color-text-faint)] text-4xl">assignment</span>
      <p class="text-sm text-[var(--color-text-muted)] mt-3 text-center">
        Belum ada data pengawasan.<br />Pastikan tindakan sudah dipilih.
      </p>
      <button class="btn btn-outline mt-4" @click="store.fetchMonevData()">Muat Ulang</button>
    </div>

    <div v-else>
      <!-- Info tindakan -->
      <div class="info-box info-box--info mb-5">
        <span class="material-icons text-xl shrink-0">assignment_turned_in</span>
        <div class="flex flex-col gap-0.5">
          <p class="text-xs text-[var(--color-text-muted)]">Tindakan dipilih</p>
          <p class="text-sm font-semibold">{{ store.formState.tindakan_label }}</p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="monev-tabs-wrapper mb-5">
        <div class="monev-tabs-scroll">
          <button
            v-for="tab in store.monevTabs"
            :key="tab.id"
            type="button"
            class="monev-tab"
            :class="{ active: activeTabId === tab.id }"
            @click="onTabChange(tab.id)"
          >
            <span class="truncate max-w-[140px]">{{ tab.label }}</span>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <Transition name="slide-fade" mode="out-in">
        <div v-if="activeTab" :key="activeTabId" class="flex flex-col gap-2">
          <!-- Info pilih accordion -->
          <p class="text-xs text-[var(--color-text-muted)] mb-2">
            Pilih bagian yang ingin dilaporkan, lalu isi pertanyaannya.
          </p>

          <!-- Accordion list — exclusive (1 aktif) -->
          <MonevAccordion
            v-for="section in activeTab.sections"
            :key="section.id"
            :section="section"
            :is-active="activeSectionId === section.id"
            @toggle="onAccordionToggle"
          />
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

// ── Tab state ──────────────────────────────────────────────────
const activeTabId = ref('')

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

function onTabChange(tabId) {
  activeTabId.value = tabId
  activeSectionId.value = ''
}

// ── Accordion exclusive state ──────────────────────────────────
const activeSectionId = ref('')

function onAccordionToggle(sectionId) {
  activeSectionId.value = activeSectionId.value === sectionId ? '' : sectionId
}

// Expose activeSectionId ke parent via store agar buildPayload tahu section mana
watch(activeSectionId, (id) => {
  store.setActiveSection(id)
})

// onMounted(() => store.fetchMonevData())
onMounted(() => {
  console.log('[Step6Monev] tindakan_value:', store.formState.tindakan_value)
  store.fetchMonevData()
})
</script>
