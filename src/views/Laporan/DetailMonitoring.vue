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
          <!-- Status Badge  Tombol Edit -->
          <div class="ml-auto flex items-center gap-3">
            <span
              v-if="statusData.status === 'close'"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
              style="background-color: #dcfce7; color: #15803d"
            >
              <span class="material-icons text-sm">check_circle</span>
              Close
            </span>
            <span
              v-else
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium"
              style="background-color: #fef9c3; color: #a16207"
            >
              <span class="material-icons text-sm">pending</span>
              Open
            </span>
            <button
              @click="openStatusModal"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors"
              :style="{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }"
            >
              <span class="material-icons text-base">edit</span>
              Ubah Status
            </button>
          </div>
        </div>

        <!-- Catatan (jika ada) -->
        <div
          v-if="statusData.catatan"
          class="mb-6 flex items-start gap-3 bg-surface border border-surface-2 rounded-xl px-4 py-3"
        >
          <span class="material-icons text-text-muted mt-0.5">notes</span>
          <div>
            <p class="text-xs text-text-muted mb-1">Catatan Tindak Lanjut</p>
            <p class="text-sm text-text">{{ statusData.catatan }}</p>
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

      <!-- Modal Update Status -->
      <Transition name="fade">
        <div
          v-if="showStatusModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background-color: rgba(0, 0, 0, 0.4)"
          @click.self="closeStatusModal"
        >
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-text text-lg">Ubah Status</h3>
                <p class="text-xs text-text-muted mt-0.5 truncate max-w-xs">
                  {{ statusData.ticket_no || route.params.id }}
                </p>
              </div>
              <button
                @click="closeStatusModal"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-offset transition-colors"
              >
                <span class="material-icons text-text-muted">close</span>
              </button>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-text mb-2">Status</label>
              <div class="flex gap-3">
                <button
                  @click="modalStatus = 'open'"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                  :style="
                    modalStatus === 'open'
                      ? { borderColor: '#a16207', backgroundColor: '#fef9c3', color: '#a16207' }
                      : { borderColor: '#e5e7eb', backgroundColor: '#fff', color: '#6b7280' }
                  "
                >
                  <span class="material-icons text-base">pending</span>
                  Open
                </button>
                <button
                  @click="modalStatus = 'close'"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                  :style="
                    modalStatus === 'close'
                      ? { borderColor: '#15803d', backgroundColor: '#dcfce7', color: '#15803d' }
                      : { borderColor: '#e5e7eb', backgroundColor: '#fff', color: '#6b7280' }
                  "
                >
                  <span class="material-icons text-base">check_circle</span>
                  Close
                </button>
              </div>
            </div>

            <Transition name="slide-down">
              <div v-if="modalStatus === 'close'" class="mb-5">
                <label class="block text-sm font-medium text-text mb-2">
                  Catatan
                  <span class="text-text-muted font-normal">(opsional)</span>
                </label>
                <textarea
                  v-model="modalCatatan"
                  rows="3"
                  placeholder="Tuliskan catatan tindak lanjut..."
                  class="w-full border border-surface-2 rounded-xl px-3 py-2.5 text-sm text-text resize-none focus:outline-none focus:ring-2 transition-all"
                  :style="{ '--tw-ring-color': 'var(--color-primary)' }"
                ></textarea>
              </div>
            </Transition>

            <p
              v-if="store.updateStatusError"
              class="text-sm text-red-600 mb-4 flex items-center gap-1"
            >
              <span class="material-icons text-base">error_outline</span>
              {{ store.updateStatusError }}
            </p>

            <div class="flex gap-3">
              <button
                @click="closeStatusModal"
                class="flex-1 py-2.5 rounded-xl border border-surface-2 text-sm font-medium text-text-muted hover:bg-surface-offset transition-colors"
              >
                Batal
              </button>
              <button
                @click="handleUpdateStatus"
                :disabled="store.isUpdatingStatus"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                :style="{ backgroundColor: 'var(--color-primary)' }"
              >
                <span v-if="store.isUpdatingStatus" class="material-icons text-base animate-spin">
                  refresh
                </span>
                {{ store.isUpdatingStatus ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </UserLayoutApp>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
// STATUS STATE — dari router state (dikirim LaporanMonitoring)
// ============================================================
const statusData = ref({
  status: history.state?.status || 'open',
  catatan: history.state?.catatan || '',
  ticket_no: history.state?.ticket_no || '',
})

const showStatusModal = ref(false)
const modalStatus = ref(statusData.value.status)
const modalCatatan = ref(statusData.value.catatan)

const openStatusModal = () => {
  modalStatus.value = statusData.value.status
  modalCatatan.value = statusData.value.catatan
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
}

const handleUpdateStatus = async () => {
  const result = await store.updateStatus(route.params.id, modalStatus.value, modalCatatan.value)
  if (result.success) {
    statusData.value.status = modalStatus.value
    statusData.value.catatan = modalCatatan.value
    closeStatusModal()
  }
}

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  store.fetchSubmissionDetail(route.params.id)
})
</script>
