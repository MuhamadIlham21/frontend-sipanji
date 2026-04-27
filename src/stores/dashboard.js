import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { monitoringApi } from '@/api/monitoring-api'

export const useDashboardStore = defineStore('dashboard', () => {
  // ============================================================
  // STATE
  // ============================================================
  const kpi = ref({
    total_submission: 0,
    today_submission: 0,
    weekly_submission: 0,
    monthly_submission: 0,
  })
  const grafikTren = ref([])
  const distribusiProvinsi = ref([])
  const distribusiEmbarkasi = ref([])
  const dataTerbaru = ref([])

  const isLoading = ref(false)
  const error = ref(null)

  // ============================================================
  // COMPUTED
  // ============================================================
  const trenSeries = computed(() => [
    {
      name: 'Submission',
      data: grafikTren.value.map((item) => item.total),
    },
  ])

  const trenCategories = computed(() =>
    grafikTren.value.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    }),
  )

  // Filter hanya yang total > 0
  const provinsiChartData = computed(() =>
    distribusiProvinsi.value.filter((item) => item.total > 0),
  )

  const embarkasiChartData = computed(() =>
    distribusiEmbarkasi.value.filter((item) => item.total > 0),
  )

  // ============================================================
  // ACTIONS
  // ============================================================
  async function fetchDashboard() {
    isLoading.value = true
    error.value = null

    try {
      const { data: res } = await monitoringApi.getDashboard()
      if (!res.success) throw new Error(res.message)

      const d = res.data
      kpi.value = d.kpi[0] || kpi.value
      grafikTren.value = d.grafik_tren || []
      distribusiProvinsi.value = d.distribusi_provinsi || []
      distribusiEmbarkasi.value = d.distribusi_embarkasi || []
      dataTerbaru.value = d.data_terbaru || []
    } catch (err) {
      error.value = err?.response?.data?.message || err.message || 'Gagal memuat dashboard'
    } finally {
      isLoading.value = false
    }
  }

  return {
    kpi,
    grafikTren,
    distribusiProvinsi,
    distribusiEmbarkasi,
    dataTerbaru,
    isLoading,
    error,
    trenSeries,
    trenCategories,
    provinsiChartData,
    embarkasiChartData,
    fetchDashboard,
  }
})
