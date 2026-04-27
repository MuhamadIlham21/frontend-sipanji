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
        <!-- Badge Tipe -->
        <template #actions="{ row }">
          <button
            @click="viewDetail(row)"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-white"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            <span class="material-icons text-base">visibility</span>
            Detail
          </button>
        </template>
      </DataTable>
    </template>
  </UserLayoutApp>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import UserLayoutApp from '@/Layouts/UserLayoutApp.vue'
import DataTable from '@/components/DataTable/DataTable.vue'
import { useMonitoringSubmissionStore } from '@/stores/monitoring-submission'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useMonitoringSubmissionStore()

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
]

// ============================================================
// COMPUTED
// ============================================================
const tableData = computed(() => {
  return store.paginatedSubmissions.map((item) => ({
    ...item,
    ticket_no: item.ticket_no || '-',
    nama: item.nama || '-',
    nik: item.nik || '-',
    email: item.email || '-',
    tipe: item.tipe || '-',
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
  router.push({ name: 'laporan.monitoring.detail', params: { id: row.id } })
}

onMounted(() => {
  store.fetchSubmissions()
})
</script>
