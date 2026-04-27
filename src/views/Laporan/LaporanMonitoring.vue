<template>
  <UserLayoutApp>
    <template #main-admin>
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-xl font-bold text-text flex items-center gap-2">
          <span class="material-icons" :style="{ color: 'var(--color-primary)' }">
            assignment_turned_in
          </span>
          Laporan Monitoring
        </h1>
        <p class="text-text-muted text-sm mt-1">
          Daftar seluruh hasil submit monitoring operasional haji
        </p>
      </div>

      <!-- DataTable -->
      <DataTable
        :columns="columns"
        :data="tableData"
        :total-items="store.totalSubmissions"
        :loading="store.isLoading"
        :error="store.error"
        @fetch-data="onFetchData"
      >
        <!-- Badge Status -->
        <template #cell-status="{ value }">
          <span
            v-if="value === 'close'"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style="background-color: #dcfce7; color: #15803d"
          >
            <span class="material-icons text-sm">check_circle</span>
            Close
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
            style="background-color: #fef9c3; color: #a16207"
          >
            <span class="material-icons text-sm">pending</span>
            Open
          </span>
        </template>
        <!-- Badge Tipe -->
        <template #actions="{ row }">
          <div class="flex items-center justify-end gap-2">
            <button
              @click="openStatusModal(row)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border"
              :style="{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
              }"
            >
              <span class="material-icons text-base">edit</span>
              Status
            </button>
            <button
              @click="viewDetail(row)"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-white"
              :style="{ backgroundColor: 'var(--color-primary)' }"
            >
              <span class="material-icons text-base">visibility</span>
              Detail
            </button>
          </div>
        </template>
      </DataTable>

      <Transition name="fade">
        <div
          v-if="showStatusModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background-color: rgba(0, 0, 0, 0.4)"
          @click.self="closeStatusModal"
        >
          <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="font-semibold text-text text-lg">Ubah Status</h3>
                <p class="text-xs text-text-muted mt-0.5 truncate max-w-xs">
                  {{ modalRow?.ticket_no }}
                </p>
              </div>
              <button
                @click="closeStatusModal"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-offset transition-colors"
              >
                <span class="material-icons text-text-muted">close</span>
              </button>
            </div>

            <!-- Pilih Status -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-text mb-2">Status</label>
              <div class="flex gap-3">
                <!-- Open -->
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
                <!-- Close -->
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

            <!-- Catatan — hanya muncul jika status close -->
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

            <!-- Error -->
            <p
              v-if="store.updateStatusError"
              class="text-sm text-red-600 mb-4 flex items-center gap-1"
            >
              <span class="material-icons text-base">error_outline</span>
              {{ store.updateStatusError }}
            </p>

            <!-- Footer -->
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
import { computed, onMounted, ref } from 'vue'
import UserLayoutApp from '@/Layouts/UserLayoutApp.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import { useMonitoringSubmissionStore } from '@/stores/monitoring-submission'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useMonitoringSubmissionStore()

// ============================================================
// MODAL STATE
// ============================================================
const showStatusModal = ref(false)
const modalRow = ref(null)
const modalStatus = ref('open')
const modalCatatan = ref('')

const openStatusModal = (row) => {
  modalRow.value = row
  modalStatus.value = row.status || 'open'
  modalCatatan.value = row.catatan || ''
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  modalRow.value = null
  modalCatatan.value = ''
}

const handleUpdateStatus = async () => {
  if (!modalRow.value) return
  const result = await store.updateStatus(modalRow.value.id, modalStatus.value, modalCatatan.value)
  if (result.success) closeStatusModal()
}

// ============================================================
// COLUMNS
// ============================================================
const columns = [
  { key: 'ticket_no', label: 'Ticket No', sortable: true },
  { key: 'nama', label: 'Nama', sortable: true },
  { key: 'nik', label: 'NIK / NIP', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  {
    key: 'tipe',
    label: 'Tipe',
    sortable: false,
    style: (value) => {
      if (value === 'Daily Monitor') return 'bg-blue-100 text-blue-700 text-xs font-medium'
      if (value === 'Temuan') return 'bg-amber-100 text-amber-700 text-xs font-medium'
      return 'bg-gray-100 text-gray-500 text-xs'
    },
  },
  { key: 'status', label: 'Status', sortable: false },
]

// ============================================================
// COMPUTED
// ============================================================
const tableData = computed(() => {
  return store.paginatedSubmissions.map((item) => ({
    ...item,
    ticket_no: item.ticket_no || '-',
    nama: decodeHtml(item.nama) || '-',
    nik: item.nik || '-',
    email: decodeHtml(item.email) || '-',
    tipe: item.tipe || '-',
    status: item.status || 'open',
    catatan: item.catatan || '',
  }))
})

// ============================================================
// METHODS
// ============================================================
const onFetchData = (params) => {
  store.setPage(params.page)
  store.setPageSize(params.limit)
  // Hanya fetch dari API jika belum ada data atau search berubah
  if (store.submissions.length === 0) {
    store.fetchSubmissions()
  }
}

const viewDetail = (row) => {
  // router.push({ name: 'laporan.monitoring.detail', params: { id: row.id } })
  router.push({
    name: 'laporan.monitoring.detail',
    params: { id: row.id },
    state: {
      status: row.status || 'open',
      catatan: row.catatan || '',
      ticket_no: row.ticket_no || '',
    },
  })
}

function decodeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
}

onMounted(() => {
  store.fetchSubmissions()
})
</script>
