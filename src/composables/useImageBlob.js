import { ref } from 'vue'
import { monitoringApi } from '@/api/monitoring-api'

export function useImageBlob() {
  const blobCache = ref({})

  async function getBlobUrl(uploadId) {
    if (blobCache.value[uploadId]) return blobCache.value[uploadId]

    try {
      const { data: blob } = await monitoringApi.getUploadFile(uploadId)
      const url = URL.createObjectURL(blob)
      blobCache.value[uploadId] = url
      return url
    } catch {
      return null
    }
  }

  function revoke() {
    Object.values(blobCache.value).forEach((url) => URL.revokeObjectURL(url))
    blobCache.value = {}
  }

  return { blobCache, getBlobUrl, revoke }
}
