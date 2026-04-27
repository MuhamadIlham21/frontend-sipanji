<template>
  <div class="question-item">
    <!-- Label -->
    <label class="question-label">
      <span>{{ question.label }}</span>
      <span v-if="question.is_required" class="text-[var(--color-error)] ml-1">*</span>
    </label>

    <!-- ── RADIO ── -->
    <div v-if="question.question_type === 'radio'" class="radio-group">
      <button
        v-for="opt in question.options"
        :key="opt.id"
        type="button"
        class="radio-pill"
        :class="{ active: modelValue === opt.value }"
        @click="emit('update:modelValue', opt.value)"
      >
        <span class="radio-pill-dot" :class="{ active: modelValue === opt.value }" />
        {{ opt.label }}
      </button>
    </div>

    <!-- ── TEXT ── -->
    <textarea
      v-else-if="question.question_type === 'text'"
      :value="modelValue || ''"
      rows="3"
      class="input-field rounded-2xl resize-none"
      placeholder="Tulis keterangan..."
      @input="emit('update:modelValue', $event.target.value)"
    />

    <!-- ── DROPDOWN ── -->
    <div v-else-if="question.question_type === 'dropdown'" class="flex flex-col gap-1">
      <select
        :value="modelValue || ''"
        class="input-field"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <!-- Placeholder kosong -->
        <option value="" disabled>Pilih salah satu...</option>

        <!-- Options dari API -->
        <option v-for="opt in question.options || []" :key="opt.id" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <p class="text-xs text-[var(--color-text-faint)]">Pilih jawaban yang paling sesuai.</p>
    </div>

    <!-- <div v-else-if="question.question_type === 'dropdown'" class="flex flex-col gap-1">
      <input
        type="text"
        :value="modelValue || ''"
        class="input-field"
        placeholder="Ketik jawaban..."
        @input="emit('update:modelValue', $event.target.value)"
      />
      <p class="text-xs text-[var(--color-text-faint)]">Data pilihan belum tersedia — isi manual</p>
    </div> -->

    <!-- ── FILE (multiple images) ── -->
    <div v-else-if="question.question_type === 'file'" class="file-upload-area">
      <!-- Dropzone -->
      <label
        class="dropzone"
        :class="{ 'dropzone--dragover': isDragging, 'dropzone--uploading': isUploading }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onDrop($event)"
      >
        <input
          type="file"
          accept="image/*"
          multiple
          class="sr-only"
          :disabled="isUploading"
          @change="onFileChange($event)"
        />

        <div v-if="isUploading" class="flex flex-col items-center gap-2">
          <span class="material-icons text-[var(--color-primary)] text-3xl animate-spin">
            autorenew
          </span>
          <p class="text-sm text-[var(--color-text-muted)]">
            Mengupload {{ uploadProgress.current }} / {{ uploadProgress.total }}...
          </p>
        </div>

        <div v-else class="flex flex-col items-center gap-2">
          <span class="material-icons text-[var(--color-text-faint)] text-3xl">
            add_photo_alternate
          </span>
          <p class="text-sm text-[var(--color-text-muted)]">Klik atau seret foto ke sini</p>
          <p class="text-xs text-[var(--color-text-faint)]">
            JPG, PNG, WEBP — Bisa lebih dari 1 foto
          </p>
        </div>
      </label>

      <!-- Error upload -->
      <p v-if="uploadError" class="text-xs text-[var(--color-error)] mt-1">
        {{ uploadError }}
      </p>

      <!-- Preview grid -->
      <div v-if="uploadedFiles.length > 0" class="image-preview-grid mt-3">
        <div v-for="(file, index) in uploadedFiles" :key="file.id" class="image-preview-item">
          <div
            class="image-preview-thumb bg-[var(--color-surface-2)] flex flex-col items-center justify-center gap-1 p-1"
          >
            <span class="material-icons text-[var(--color-text-faint)] text-2xl">image</span>
            <p
              class="text-[10px] text-[var(--color-text-faint)] text-center truncate w-full px-1 leading-tight"
            >
              {{ file.file_name }}
            </p>
          </div>
          <button
            type="button"
            class="image-preview-remove"
            :disabled="isUploading"
            @click="removeImage(index)"
            aria-label="Hapus foto"
          >
            <span class="material-icons text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMonitoringStore } from '@/stores/monitoring'

// ── Props & Emits ──────────────────────────────────────────────
const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  // modelValue: untuk radio/text/dropdown → string/id
  // untuk file → array of URL strings (JSON.stringify jika perlu)
  modelValue: {
    type: [String, Array],
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const store = useMonitoringStore()

// ── File upload state ──────────────────────────────────────────
const isDragging = ref(false)
const isUploading = ref(false)
const uploadError = ref(null)
const uploadProgress = ref({ current: 0, total: 0 })

// uploadedFiles: [{ id, file_name, object_name }]
const uploadedFiles = ref([])

// watch(
//   () => props.modelValue,
//   (val) => {
//     if (props.question.question_type === 'file') {
//       if (!val || (Array.isArray(val) && val.length === 0)) {
//         uploadedFiles.value = []
//       }
//     }
//   },
// )

function restorePreviewFromIds(ids) {
  uploadedFiles.value = ids.map((id, idx) => ({
    id,
    file_name: `Lampiran ${idx + 1}`,
  }))
}

watch(
  () => props.modelValue,
  (val) => {
    if (props.question.question_type !== 'file') return
    if (!val || (Array.isArray(val) && val.length === 0)) {
      uploadedFiles.value = []
      return
    }
    // Restore preview jika uploadedFiles kosong (habis unmount)
    if (Array.isArray(val) && uploadedFiles.value.length === 0) {
      restorePreviewFromIds(val)
    }
  },
  { immediate: true },
)

onMounted(() => {
  if (
    props.question.question_type === 'file' &&
    Array.isArray(props.modelValue) &&
    props.modelValue.length > 0 &&
    uploadedFiles.value.length === 0
  ) {
    restorePreviewFromIds(props.modelValue)
  }
})

// ── File handler ───────────────────────────────────────────────
async function onFileChange(event) {
  const files = event.target.files
  if (!files || files.length === 0) return
  await processFiles(files)
  // Reset input agar file yang sama bisa dipilih ulang
  event.target.value = ''
}

async function onDrop(event) {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (!files || files.length === 0) return
  await processFiles(files)
}

async function processFiles(files) {
  isUploading.value = true
  uploadError.value = null
  uploadProgress.value = { current: 0, total: files.length }

  try {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        uploadError.value = `File "${file.name}" bukan gambar`
        continue
      }
      if (file.size > 5 * 1024 * 1024) {
        uploadError.value = `File "${file.name}" terlalu besar (max 5MB)`
        continue
      }
      const result = await store.uploadFile(file)
      if (result) uploadedFiles.value.push(result)
      uploadProgress.value.current++
    }
    emit(
      'update:modelValue',
      uploadedFiles.value.map((f) => f.id),
    )
  } catch (err) {
    uploadError.value = err.message || 'Gagal mengupload foto'
  } finally {
    isUploading.value = false
  }
}

function removeImage(index) {
  uploadedFiles.value.splice(index, 1)
  emit(
    'update:modelValue',
    uploadedFiles.value.map((f) => f.id),
  )
}
</script>
