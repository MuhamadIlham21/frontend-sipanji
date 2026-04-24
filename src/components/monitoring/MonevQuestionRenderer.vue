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
        :class="{ active: modelValue === opt.id }"
        @click="emit('update:modelValue', opt.id)"
      >
        <span
          class="radio-pill-dot"
          :class="{ active: modelValue === opt.id }"
        />
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

    <!-- ── DROPDOWN (tanpa options dari API) ── -->
    <div
      v-else-if="question.question_type === 'dropdown'"
      class="flex flex-col gap-1"
    >
      <input
        type="text"
        :value="modelValue || ''"
        class="input-field"
        placeholder="Ketik jawaban..."
        @input="emit('update:modelValue', $event.target.value)"
      />
      <p class="text-xs text-[var(--color-text-faint)]">
        Data pilihan belum tersedia — isi manual
      </p>
    </div>

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
          <p class="text-sm text-[var(--color-text-muted)]">
            Klik atau seret foto ke sini
          </p>
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
      <div v-if="uploadedUrls.length > 0" class="image-preview-grid mt-3">
        <div
          v-for="(url, index) in uploadedUrls"
          :key="url"
          class="image-preview-item"
        >
          <img
            :src="url"
            :alt="`Foto ${index + 1}`"
            class="image-preview-thumb"
            loading="lazy"
          />
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
import { ref, watch } from 'vue'
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
const isDragging      = ref(false)
const isUploading     = ref(false)
const uploadError     = ref(null)
const uploadProgress  = ref({ current: 0, total: 0 })

// uploadedUrls: array URL hasil upload — sync dari modelValue jika array
const uploadedUrls = ref(
  Array.isArray(props.modelValue) ? [...props.modelValue] : []
)

// Sync jika modelValue berubah dari luar (misal saat reset)
watch(
  () => props.modelValue,
  (val) => {
    if (props.question.question_type === 'file') {
      uploadedUrls.value = Array.isArray(val) ? [...val] : []
    }
  },
)

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
  isUploading.value    = true
  uploadError.value    = null
  uploadProgress.value = { current: 0, total: files.length }

  try {
    const newUrls = []

    for (const file of Array.from(files)) {
      // Validasi tipe
      if (!file.type.startsWith('image/')) {
        uploadError.value = `File "${file.name}" bukan gambar`
        continue
      }
      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        uploadError.value = `File "${file.name}" terlalu besar (max 5MB)`
        continue
      }

      const url = await store.uploadFile(file)
      if (url) newUrls.push(url)
      uploadProgress.value.current++
    }

    uploadedUrls.value = [...uploadedUrls.value, ...newUrls]
    emit('update:modelValue', uploadedUrls.value)
  } catch (err) {
    uploadError.value = err.message || 'Gagal mengupload foto'
  } finally {
    isUploading.value = false
  }
}

function removeImage(index) {
  uploadedUrls.value.splice(index, 1)
  emit('update:modelValue', [...uploadedUrls.value])
}
</script>