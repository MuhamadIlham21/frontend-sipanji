<template>
  <div class="accordion-wrapper">
    <!-- Section Header -->
    <button
      type="button"
      class="accordion-header"
      :class="{ open: isOpen, submitted: isSubmitted }"
      @click="toggle"
    >
      <!-- Status icon -->
      <div class="accordion-status-icon">
        <span v-if="isSubmitted" class="material-icons text-base text-[var(--color-success)]">
          check_circle
        </span>
        <span v-else-if="isOpen" class="material-icons text-base text-[var(--color-primary)]">
          edit_note
        </span>
        <span v-else class="material-icons text-base text-[var(--color-text-faint)]">
          radio_button_unchecked
        </span>
      </div>

      <!-- Label -->
      <div class="flex-1 text-left min-w-0">
        <p
          class="text-sm font-semibold leading-snug truncate"
          :class="isSubmitted ? 'text-[var(--color-success)]' : 'text-[var(--color-text)]'"
        >
          {{ section.label }}
        </p>
        <p v-if="isSubmitted" class="text-xs text-[var(--color-success)] mt-0.5">Tersimpan ✓</p>
        <p v-else class="text-xs text-[var(--color-text-muted)] mt-0.5">
          {{ section.questions.length }} pertanyaan
        </p>
      </div>

      <!-- Chevron -->
      <span
        class="material-icons text-[var(--color-text-faint)] text-xl transition-transform duration-300 shrink-0"
        :class="isOpen ? 'rotate-180' : ''"
      >
        expand_more
      </span>
    </button>

    <!-- Section Body -->
    <Transition name="accordion">
      <div v-if="isOpen" class="accordion-body">
        <!-- Questions -->
        <div class="flex flex-col">
          <MonevQuestionRenderer
            v-for="question in section.questions"
            :key="question.id"
            :question="question"
            :model-value="getAnswer(question.id)"
            @update:model-value="setAnswer(question.id, $event)"
          />
        </div>

        <!-- Submit bar -->
        <div class="accordion-submit-bar">
          <!-- Error -->
          <Transition name="fade">
            <p v-if="submitError" class="text-xs text-[var(--color-error)] flex items-center gap-1">
              <span class="material-icons text-sm">error_outline</span>
              {{ submitError }}
            </p>
          </Transition>

          <div class="flex items-center gap-3 ml-auto">
            <!-- Reset section -->
            <button
              v-if="hasAnswers && !isSubmitted"
              type="button"
              class="btn btn-ghost text-sm px-3 py-2"
              :disabled="store.isSubmitting"
              @click="confirmReset"
            >
              Reset
            </button>

            <!-- Submit button -->
            <button
              type="button"
              class="btn btn-primary gap-2 text-sm px-5 py-2.5"
              :disabled="store.isSubmitting || isSubmitted"
              @click="handleSubmit"
            >
              <span
                v-if="store.isSubmitting && submittingThisSection"
                class="material-icons text-base animate-spin"
              >
                autorenew
              </span>
              <span v-else class="material-icons text-base">
                {{ isSubmitted ? 'check_circle' : 'save' }}
              </span>
              {{ isSubmitted ? 'Tersimpan' : 'Simpan Bagian Ini' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Reset Confirm Modal -->
    <Transition name="fade">
      <div
        v-if="showResetConfirm"
        class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
        @click.self="showResetConfirm = false"
      >
        <div class="bg-[var(--color-surface)] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <h3 class="text-base font-bold text-[var(--color-text)] mb-1">Reset Bagian Ini?</h3>
          <p class="text-sm text-[var(--color-text-muted)] mb-5">
            Semua jawaban pada bagian
            <strong class="text-[var(--color-text)]">"{{ section.label }}"</strong>
            akan dihapus.
          </p>
          <div class="flex gap-3">
            <button class="flex-1 btn btn-outline text-sm py-2" @click="showResetConfirm = false">
              Batal
            </button>
            <button class="flex-1 btn btn-primary text-sm py-2" @click="doReset">Ya, Reset</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import MonevQuestionRenderer from './MonevQuestionRenderer.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
    // { id, label, questions: [] }
  },
  // Accordion terbuka by default atau tidak
  defaultOpen: {
    type: Boolean,
    default: false,
  },
})

const store = useMonitoringStore()

// ── Accordion state ────────────────────────────────────────────
const isOpen = ref(props.defaultOpen)
const toggle = () => {
  isOpen.value = !isOpen.value
}

// ── Submit state ───────────────────────────────────────────────
const submitError = ref(null)
const showResetConfirm = ref(false)
const submittingThisSection = ref(false)

const isSubmitted = computed(() => store.isSectionSubmitted(props.section.id))

// ── Answers ────────────────────────────────────────────────────
const getAnswer = (questionId) => {
  return store.formState.monev_answers[props.section.id]?.[questionId] ?? ''
}

const setAnswer = (questionId, value) => {
  store.setMonevAnswer(props.section.id, questionId, value)
}

const hasAnswers = computed(() => {
  const sectionAnswers = store.formState.monev_answers[props.section.id]
  return sectionAnswers && Object.keys(sectionAnswers).length > 0
})

// ── Submit ─────────────────────────────────────────────────────
async function handleSubmit() {
  if (isSubmitted.value) return

  submitError.value = null
  submittingThisSection.value = true

  try {
    await store.submitMonev(props.section.id)
    // Auto tutup accordion setelah submit sukses
    setTimeout(() => {
      isOpen.value = false
    }, 600)
  } catch (err) {
    submitError.value = store.submitError || 'Gagal menyimpan. Coba lagi.'
    console.error('Submit Monev Error:', err)
  } finally {
    submittingThisSection.value = false
  }
}

// ── Reset ──────────────────────────────────────────────────────
function confirmReset() {
  showResetConfirm.value = true
}

function doReset() {
  store.clearMonevSection(props.section.id)
  submitError.value = null
  showResetConfirm.value = false
}
</script>
