<template>
  <div class="relative" :class="containerClass">
    <!-- Loading skeleton -->
    <div
      v-if="isLoading"
      class="w-full h-full rounded-lg bg-surface-offset animate-pulse"
      :style="{ minHeight: '128px' }"
    ></div>

    <!-- Error -->
    <div
      v-else-if="isError"
      class="w-full h-full rounded-lg bg-surface-offset flex flex-col items-center justify-center gap-1 text-text-faint"
      :style="{ minHeight: '128px' }"
    >
      <span class="material-icons text-2xl">broken_image</span>
      <span class="text-xs">Gagal memuat</span>
    </div>

    <!-- Image -->
    <img
      v-else-if="blobUrl"
      :src="blobUrl"
      :alt="alt"
      class="w-full h-full object-cover rounded-lg"
      :class="imgClass"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { monitoringApi } from '@/api/monitoring-api'

const props = defineProps({
  uploadId: { type: String, required: true },
  alt: { type: String, default: 'Gambar' },
  containerClass: { type: String, default: '' },
  imgClass: { type: String, default: '' },
})

const blobUrl = ref(null)
const isLoading = ref(true)
const isError = ref(false)

onMounted(async () => {
  try {
    const { data: blob } = await monitoringApi.getUploadFile(props.uploadId)
    // blobUrl.value = URL.createObjectURL(blob)
    // Buat ulang Blob dengan MIME type dari response, fallback ke octet-stream
    const mime = blob.type || 'application/octet-stream'
    const typedBlob = new Blob([blob], { type: mime })
    blobUrl.value = URL.createObjectURL(typedBlob)
  } catch {
    isError.value = true
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
})
</script>
