<template>
  <UserLayoutApp>
    <template #main-admin>
      <!-- Loading -->
      <div v-if="store.isLoadingDetail" class="space-y-4">
        <div class="animate-pulse bg-surface rounded-xl h-48"></div>
        <div class="animate-pulse bg-surface rounded-xl h-64"></div>
      </div>

      <!-- Error -->
      <div v-else-if="store.detailError" class="bg-surface rounded-xl p-8 text-center">
        <span class="material-icons text-5xl text-error mb-3 block">error_outline</span>
        <p class="text-text font-medium">{{ store.detailError }}</p>
        <button
          @click="router.back()"
          class="mt-4 px-4 py-2 rounded-lg text-sm font-medium border border-surface-2 hover:bg-surface-2 transition-colors text-text-muted"
        >
          Kembali
        </button>
      </div>

      <template v-else-if="store.currentDetail">
        <!-- Back Button  Ticket Info -->
        <div class="flex items-center gap-3 mb-6">
          <button
            @click="router.back()"
            class="p-2 rounded-lg hover:bg-surface-2 transition-colors text-text-muted"
          >
            <span class="material-icons">arrow_back</span>
          </button>
          <div>
            <h1 class="text-lg font-bold text-text">Detail Submission</h1>
            <p class="text-sm text-text-muted">{{ route.params.id }}</p>
          </div>
        </div>

        <!-- Informasi Umum -->
        <div class="bg-surface rounded-xl shadow-sm border border-surface-2 mb-6 overflow-hidden">
          <div
            class="px-5 py-4 border-b border-surface-2 flex items-center gap-2"
            :style="{ borderLeftColor: 'var(--color-primary)', borderLeftWidth: '4px' }"
          >
            <span class="material-icons text-lg" :style="{ color: 'var(--color-primary)' }">
              info
            </span>
            <h2 class="font-semibold text-text">Informasi Umum</h2>
          </div>
          <div class="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in store.currentDetail.infoUmum"
              :key="item.label"
              class="bg-background rounded-lg p-3"
            >
              <p class="text-xs text-text-muted mb-1">{{ item.label }}</p>
              <p class="text-sm font-medium text-text">{{ item.value || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Sections Hasil Monitoring -->
        <div
          v-for="section in store.currentDetail.sections"
          :key="section.title"
          class="bg-surface rounded-xl shadow-sm border border-surface-2 mb-4 overflow-hidden"
        >
          <!-- Section Header -->
          <div
            class="px-5 py-4 border-b border-surface-2 flex items-center gap-2"
            :style="{ borderLeftColor: 'var(--color-accent)', borderLeftWidth: '4px' }"
          >
            <span class="material-icons text-lg" :style="{ color: 'var(--color-accent)' }">
              folder_open
            </span>
            <div>
              <!-- Section title bisa berupa "A > B", tampilkan dengan hierarchy -->
              <template v-if="section.title.includes('>')">
                <p class="text-xs text-text-muted">
                  {{ section.title.split('>')[0].trim() }}
                </p>
                <h2 class="font-semibold text-text text-sm">
                  {{ section.title.split('>').slice(1).join('>').trim() }}
                </h2>
              </template>
              <h2 v-else class="font-semibold text-text">{{ section.title }}</h2>
            </div>
          </div>

          <!-- Section Items -->
          <div class="divide-y divide-surface-2">
            <div v-for="item in section.items" :key="item.label" class="px-5 py-4">
              <p class="text-sm text-text-muted mb-2">{{ item.label }}</p>

              <!-- Image Array -->
              <div v-if="store.isImageArray(item.value)" class="flex flex-wrap gap-3 mt-2">
                <div
                  v-for="imgId in store.parseImageIds(item.value)"
                  :key="imgId"
                  class="relative group cursor-pointer"
                  @click="openLightbox(imgId, item.label)"
                >
                  <SecureImage
                    :upload-id="imgId"
                    :alt="item.label"
                    container-class="w-32 h-32"
                    img-class="border border-surface-2 hover:opacity-90 transition-opacity"
                  />
                  <div
                    class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <span
                      class="material-icons text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      zoom_in
                    </span>
                  </div>
                </div>
              </div>

              <!-- Regular Text -->
              <p v-else class="text-sm font-medium text-text">{{ item.value || '-' }}</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Lightbox -->
      <Transition name="fade">
        <div
          v-if="lightbox.show"
          class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          @click.self="lightbox.show = false"
        >
          <div class="relative max-w-3xl w-full">
            <button
              @click="lightbox.show = false"
              class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span class="material-icons text-3xl">close</span>
            </button>
            <SecureImage
              :upload-id="lightbox.uploadId"
              :alt="lightbox.alt"
              container-class="w-full max-h-[80vh]"
              img-class="object-contain rounded-xl"
            />
            <p class="text-white/70 text-sm text-center mt-3">{{ lightbox.alt }}</p>
          </div>
        </div>
      </Transition>
    </template>
  </UserLayoutApp>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserLayoutApp from '@/Layouts/UserLayoutApp.vue'
import { useMonitoringSubmissionStore } from '@/stores/monitoring-submission'
import SecureImage from '@/components/Common/SecureImage.vue'

const route = useRoute()
const router = useRouter()
const store = useMonitoringSubmissionStore()

// ============================================================
// LIGHTBOX
// ============================================================
const lightbox = ref({ show: false, uploadId: '', alt: '' })

const openLightbox = (uploadId, alt) => {
  lightbox.value = { show: true, uploadId, alt }
}

// const getImageUrl = (uploadId) => {
//   return `${import.meta.env.VITE_API_BASE_URL || 'https://si-panji.id/api'}/secure/upload/${uploadId}`
// }

// const onImageError = (event) => {
//   event.target.style.display = 'none'
// }

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  store.fetchSubmissionDetail(route.params.id)
})
</script>
