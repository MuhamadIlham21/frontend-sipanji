<template>
  <!-- <div class="accordion-wrapper" :class="{ submitted: isSubmitted }"> -->
  <div
    class="accordion-wrapper transition-all duration-300"
    :class="{ submitted: isSubmitted }"
    :style="
      isSubmitted && !isActive
        ? { borderLeftColor: 'var(--color-success)', borderLeftWidth: '3px' }
        : { borderLeftColor: 'transparent', borderLeftWidth: '3px' }
    "
  >
    <!-- Header -->
    <button
      type="button"
      class="accordion-header"
      :class="{ open: isActive, submitted: isSubmitted }"
      @click="emit('toggle', section.id)"
    >
      <div class="accordion-status-icon">
        <span v-if="isSubmitted" class="material-icons text-base text-[var(--color-success)]">
          check_circle
        </span>
        <span v-else-if="isActive" class="material-icons text-base text-[var(--color-primary)]">
          edit_note
        </span>
        <span v-else class="material-icons text-base text-[var(--color-text-faint)]">
          radio_button_unchecked
        </span>
      </div>

      <div class="flex-1 text-left min-w-0">
        <p
          class="text-sm font-semibold leading-snug truncate"
          :class="isSubmitted ? 'text-[var(--color-success)]' : 'text-[var(--color-text)]'"
        >
          {{ section.label }}
        </p>
        <p v-if="isSubmitted" class="text-xs text-[var(--color-success)] mt-0.5">Tersimpan ✓</p>
        <!-- <p v-else class="text-xs text-[var(--color-text-muted)] mt-0.5">
          {{ section.questions.length }} pertanyaan
        </p> -->
        <p
          v-if="isSubmitted && !isActive"
          class="text-xs mt-0.5"
          style="color: var(--color-success)"
        >
          {{ filledCount }} dari {{ section.questions.length }} pertanyaan diisi ✓
        </p>
        <p v-else class="text-xs text-[var(--color-text-muted)] mt-0.5">
          {{ section.questions.length }} pertanyaan
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Badge jumlah jawaban terisi -->
        <span
          v-if="isSubmitted && !isActive"
          class="text-xs font-medium px-2 py-0.5 rounded-full"
          style="background-color: var(--color-success-highlight); color: var(--color-success)"
        >
          {{ filledCount }} diisi
        </span>
        <span
          class="material-icons text-xl transition-transform duration-300"
          :class="isActive ? 'rotate-180' : ''"
          :style="{ color: isSubmitted ? 'var(--color-success)' : 'var(--color-text-faint)' }"
        >
          expand_more
        </span>
      </div>
    </button>

    <!-- Body -->
    <Transition name="accordion">
      <div v-if="isActive" class="accordion-body">
        <MonevQuestionRenderer
          v-for="question in section.questions"
          :key="question.id"
          :question="question"
          :model-value="getAnswer(question.id)"
          @update:model-value="setAnswer(question.id, $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import MonevQuestionRenderer from './MonevQuestionRenderer.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle'])

const store = useMonitoringStore()

const isSubmitted = computed(() => store.isSectionFilled(props.section.id))
// const isSubmitted = computed(() => false)

const filledCount = computed(() => {
  const answers = store.formState.monev_answers[props.section.id]
  if (!answers) return 0
  return Object.values(answers).filter(
    (v) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0),
  ).length
})

const getAnswer = (questionId) =>
  store.formState.monev_answers[props.section.id]?.[questionId] ?? ''

const setAnswer = (questionId, value) => store.setMonevAnswer(props.section.id, questionId, value)
</script>
