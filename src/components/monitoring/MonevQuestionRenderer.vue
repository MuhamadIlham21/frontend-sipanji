<template>
  <div class="flex flex-col gap-8 divide-y divide-[var(--color-surface-2)]">
    <!-- Wrapper tiap pertanyaan -->
    <div
      v-for="(question, qIndex) in questions"
      :key="question.id"
      class="form-group pt-6 first:pt-0"
    >
      <!-- ── Nomor + Label ── -->
      <div class="flex items-start gap-3 mb-4">
        <!-- Nomor pertanyaan -->
        <span
          class="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5"
        >
          {{ qIndex + 1 }}
        </span>
        <!-- Teks pertanyaan -->
        <label class="text-sm font-medium leading-snug" style="color: var(--color-text)">
          {{ question.teks }}
          <span v-if="question.required" class="ml-1 text-[var(--color-error)] font-bold">*</span>
        </label>
      </div>

      <!-- ══ TIPE: RADIO ══ -->
      <div v-if="question.tipe === TIPE.RADIO" class="flex flex-col gap-2 pl-9">
        <label
          v-for="opsi in question.opsi"
          :key="opsi"
          class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150"
          :class="
            getAnswer(question.id) === opsi
              ? 'border-primary bg-primary-50 shadow-sm'
              : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] hover:border-primary/50 hover:bg-primary-50/50'
          "
        >
          <input
            type="radio"
            :name="`q-${accordionId}-${question.id}`"
            :value="opsi"
            :checked="getAnswer(question.id) === opsi"
            class="sr-only"
            @change="store.setAnswer(accordionId, question.id, opsi)"
          />
          <!-- Custom radio -->
          <span
            class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
            :class="
              getAnswer(question.id) === opsi
                ? 'border-primary bg-primary'
                : 'border-[var(--color-text-faint)]'
            "
          >
            <span
              v-if="getAnswer(question.id) === opsi"
              class="w-1.5 h-1.5 rounded-full bg-white"
            />
          </span>
          <span class="text-sm" style="color: var(--color-text)">{{ opsi }}</span>
        </label>

        <!-- Opsi Lainnya -->
        <template v-if="question.ada_opsi_lainnya">
          <label
            class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150"
            :class="
              getAnswer(question.id) === '__lainnya__'
                ? 'border-primary bg-primary-50 shadow-sm'
                : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] hover:border-primary/50 hover:bg-primary-50/50'
            "
          >
            <input
              type="radio"
              :name="`q-${accordionId}-${question.id}`"
              value="__lainnya__"
              :checked="getAnswer(question.id) === '__lainnya__'"
              class="sr-only"
              @change="store.setAnswer(accordionId, question.id, '__lainnya__')"
            />
            <span
              class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              :class="
                getAnswer(question.id) === '__lainnya__'
                  ? 'border-primary bg-primary'
                  : 'border-[var(--color-text-faint)]'
              "
            >
              <span
                v-if="getAnswer(question.id) === '__lainnya__'"
                class="w-1.5 h-1.5 rounded-full bg-white"
              />
            </span>
            <span class="text-sm" style="color: var(--color-text)">Lainnya</span>
          </label>
          <Transition name="fade">
            <div v-if="getAnswer(question.id) === '__lainnya__'" class="mt-1">
              <input
                type="text"
                :value="getLainnya(question.id)"
                placeholder="Sebutkan..."
                class="input-field"
                @input="store.setAnswerLainnya(accordionId, question.id, $event.target.value)"
              />
            </div>
          </Transition>
        </template>
      </div>

      <!-- ══ TIPE: CHECKBOX ══ -->
      <div v-else-if="question.tipe === TIPE.CHECKBOX" class="flex flex-col gap-2 pl-9">
        <label
          v-for="opsi in question.opsi"
          :key="opsi"
          class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150"
          :class="
            isChecked(question.id, opsi)
              ? 'border-primary bg-primary-50 shadow-sm'
              : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] hover:border-primary/50 hover:bg-primary-50/50'
          "
        >
          <input
            type="checkbox"
            :checked="isChecked(question.id, opsi)"
            class="sr-only"
            @change="toggleCheckbox(question.id, opsi)"
          />
          <!-- Custom checkbox -->
          <span
            class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
            :class="
              isChecked(question.id, opsi)
                ? 'border-primary bg-primary'
                : 'border-[var(--color-text-faint)]'
            "
          >
            <span
              v-if="isChecked(question.id, opsi)"
              class="material-icons text-white leading-none"
              style="font-size: 12px"
              >check</span
            >
          </span>
          <span class="text-sm" style="color: var(--color-text)">{{ opsi }}</span>
        </label>

        <!-- Opsi Lainnya Checkbox -->
        <template v-if="question.ada_opsi_lainnya">
          <label
            class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-150"
            :class="
              isChecked(question.id, '__lainnya__')
                ? 'border-primary bg-primary-50 shadow-sm'
                : 'border-[var(--color-surface-2)] bg-[var(--color-surface)] hover:border-primary/50 hover:bg-primary-50/50'
            "
          >
            <input
              type="checkbox"
              :checked="isChecked(question.id, '__lainnya__')"
              class="sr-only"
              @change="toggleCheckbox(question.id, '__lainnya__')"
            />
            <span
              class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
              :class="
                isChecked(question.id, '__lainnya__')
                  ? 'border-primary bg-primary'
                  : 'border-[var(--color-text-faint)]'
              "
            >
              <span
                v-if="isChecked(question.id, '__lainnya__')"
                class="material-icons text-white leading-none"
                style="font-size: 12px"
                >check</span
              >
            </span>
            <span class="text-sm" style="color: var(--color-text)">Lainnya</span>
          </label>
          <Transition name="fade">
            <div v-if="isChecked(question.id, '__lainnya__')" class="mt-1">
              <input
                type="text"
                :value="getLainnya(question.id)"
                placeholder="Sebutkan..."
                class="input-field"
                @input="store.setAnswerLainnya(accordionId, question.id, $event.target.value)"
              />
            </div>
          </Transition>
        </template>
      </div>

      <!-- ══ TIPE: TEXTAREA ══ -->
      <div v-else-if="question.tipe === TIPE.TEXTAREA" class="pl-9">
        <div
          class="rounded-2xl border-2 transition-all duration-150 overflow-hidden"
          :class="
            getAnswer(question.id) ? 'border-primary shadow-sm' : 'border-[var(--color-surface-2)]'
          "
        >
          <textarea
            :value="getAnswer(question.id) || ''"
            placeholder="Tulis catatan di sini..."
            rows="4"
            class="w-full px-4 py-3 text-sm bg-[var(--color-surface)] resize-none focus:outline-none"
            style="color: var(--color-text)"
            @input="store.setAnswer(accordionId, question.id, $event.target.value)"
          />
          <!-- Footer counter -->
          <div
            class="px-4 py-2 flex justify-between items-center text-xs border-t"
            style="
              background: var(--color-surface-2);
              border-color: var(--color-surface-2);
              color: var(--color-text-faint);
            "
          >
            <span class="flex items-center gap-1">
              <span class="material-icons text-xs">edit_note</span>
              Catatan lapangan
            </span>
            <span>{{ (getAnswer(question.id) || '').length }} karakter</span>
          </div>
        </div>
      </div>

      <!-- ══ TIPE: NUMBER ══ -->
      <div v-else-if="question.tipe === TIPE.NUMBER" class="pl-9">
        <div
          class="inline-flex items-center gap-0 rounded-2xl border-2 overflow-hidden transition-all duration-150"
          :class="
            getAnswer(question.id) ? 'border-primary shadow-sm' : 'border-[var(--color-surface-2)]'
          "
        >
          <!-- Tombol kurang -->
          <button
            class="w-11 h-11 flex items-center justify-center transition-colors"
            :class="
              getAnswer(question.id) > 0
                ? 'bg-primary-50 text-primary hover:bg-primary hover:text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-faint)]'
            "
            @click="adjustNumber(question.id, -1)"
          >
            <span class="material-icons text-base">remove</span>
          </button>

          <!-- Input angka -->
          <div
            class="flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] min-w-[100px] justify-center border-x border-[var(--color-surface-2)]"
          >
            <input
              type="number"
              :value="getAnswer(question.id) || 0"
              min="0"
              class="w-16 text-center text-base font-bold bg-transparent focus:outline-none"
              style="color: var(--color-text)"
              @input="store.setAnswer(accordionId, question.id, Number($event.target.value))"
            />
            <span
              v-if="question.satuan"
              class="text-sm shrink-0"
              style="color: var(--color-text-muted)"
            >
              {{ question.satuan }}
            </span>
          </div>

          <!-- Tombol tambah -->
          <button
            class="w-11 h-11 flex items-center justify-center bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors"
            @click="adjustNumber(question.id, 1)"
          >
            <span class="material-icons text-base">add</span>
          </button>
        </div>
      </div>

      <!-- ══ TIPE: FILE ══ -->
      <div v-else-if="question.tipe === TIPE.FILE" class="pl-9">
        <!-- Upload area -->
        <label
          class="flex flex-col items-center justify-center gap-3 px-4 py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200"
          :class="
            isDragging[question.id]
              ? 'border-primary bg-primary-50'
              : getFiles(question.id).length >= (question.max_files || 1)
                ? 'border-[var(--color-surface-2)] bg-[var(--color-surface-2)] cursor-not-allowed opacity-60'
                : 'border-[var(--color-surface-2)] hover:border-primary hover:bg-primary-50'
          "
          @dragover.prevent="setDragging(question.id, true)"
          @dragleave="setDragging(question.id, false)"
          @drop.prevent="handleDrop($event, question)"
        >
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center"
            :class="
              isDragging[question.id]
                ? 'bg-primary text-white'
                : 'bg-[var(--color-surface-2)] text-[var(--color-text-faint)]'
            "
          >
            <span class="material-icons text-2xl">cloud_upload</span>
          </div>
          <div class="text-center">
            <p class="text-sm font-medium" style="color: var(--color-text-muted)">
              Klik atau drag & drop file
            </p>
            <p class="text-xs mt-0.5" style="color: var(--color-text-faint)">
              {{ question.accept || 'image/*' }} · Maks {{ question.max_files || 1 }} file ·
              {{ getFiles(question.id).length }}/{{ question.max_files || 1 }} terupload
            </p>
          </div>
          <input
            type="file"
            :accept="question.accept || 'image/*'"
            :multiple="(question.max_files || 1) > 1"
            :disabled="getFiles(question.id).length >= (question.max_files || 1)"
            class="sr-only"
            @change="handleFileInput($event, question)"
          />
        </label>

        <!-- Preview file -->
        <div v-if="getFiles(question.id).length > 0" class="mt-3 flex flex-col gap-2">
          <div
            v-for="(entry, idx) in getFiles(question.id)"
            :key="idx"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-surface-2)] bg-[var(--color-surface)]"
          >
            <!-- Thumbnail / icon -->
            <div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <span class="material-icons text-primary text-base">
                {{ isImage(entry.file) ? 'image' : 'attach_file' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" style="color: var(--color-text)">
                {{ entry.file.name }}
              </p>
              <p class="text-xs" style="color: var(--color-text-faint)">
                {{ formatSize(entry.file.size) }}
              </p>
            </div>
            <!-- Hapus -->
            <button
              class="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
              style="color: var(--color-text-faint)"
              @click="removeFile(question.id, idx)"
            >
              <span class="material-icons text-base">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'
import { TIPE_PERTANYAAN as TIPE } from '@/constants/monitoring'

const props = defineProps({
  questions: { type: Array, required: true },
  accordionId: { type: String, required: true },
})

const store = useMonitoringStore()

// Dragging state per question.id
const isDragging = reactive({})
const setDragging = (qId, val) => {
  isDragging[qId] = val
}

// ── Answer helpers ──────────────────────────────────────────
const getAnswer = (qId) => store.formState.monev_answers[props.accordionId]?.answers[qId] ?? null

const getLainnya = (qId) =>
  store.formState.monev_answers[props.accordionId]?.answers[`${qId}_lainnya`] ?? ''

// ── Checkbox ────────────────────────────────────────────────
const isChecked = (qId, opsi) => {
  const val = getAnswer(qId)
  return Array.isArray(val) && val.includes(opsi)
}

const toggleCheckbox = (qId, opsi) => {
  const current = Array.isArray(getAnswer(qId)) ? [...getAnswer(qId)] : []
  const idx = current.indexOf(opsi)
  idx === -1 ? current.push(opsi) : current.splice(idx, 1)
  store.setAnswer(props.accordionId, qId, current)
}

// ── Number stepper ──────────────────────────────────────────
const adjustNumber = (qId, delta) => {
  const current = Number(getAnswer(qId) || 0)
  const next = Math.max(0, current + delta)
  store.setAnswer(props.accordionId, qId, next)
}

// ── File helpers ────────────────────────────────────────────
const getFiles = (qId) =>
  (store.formState.monev_answers[props.accordionId]?.files || []).filter(
    (f) => f.questionId === qId,
  )

const addFiles = (files, question) => {
  const sisa = (question.max_files || 1) - getFiles(question.id).length
  files.slice(0, sisa).forEach((file) => store.addFile(props.accordionId, question.id, file))
}

const handleFileInput = (e, question) => {
  addFiles(Array.from(e.target.files || []), question)
  e.target.value = ''
}

const handleDrop = (e, question) => {
  setDragging(question.id, false)
  if (getFiles(question.id).length >= (question.max_files || 1)) return
  addFiles(Array.from(e.dataTransfer.files || []), question)
}

const removeFile = (qId, localIdx) => {
  const all = store.formState.monev_answers[props.accordionId]?.files || []
  let count = 0
  for (let i = 0; i < all.length; i++) {
    if (all[i].questionId === qId) {
      if (count === localIdx) {
        store.removeFile(props.accordionId, qId, i)
        return
      }
      count++
    }
  }
}

const isImage = (file) => file.type.startsWith('image/')
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}
</script>
