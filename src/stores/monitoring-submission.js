import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { monitoringApi } from '@/api/monitoring-api'

export const useMonitoringSubmissionStore = defineStore('monitoringSubmission', () => {
  // ============================================================
  // STATE
  // ============================================================
  const submissions = ref([])
  const currentDetail = ref(null)
  const isLoadingDetail = ref(false)
  const detailError = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const isUpdatingStatus = ref(false)
  const updateStatusError = ref(null)

  // ============================================================
  // COMPUTED
  // ============================================================
  const totalSubmissions = computed(() => submissions.value.length)

  const paginatedSubmissions = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return submissions.value.slice(start, start + pageSize.value)
  })

  // ============================================================
  // HELPERS
  // ============================================================
  function getTipeFromTicket(ticketNo) {
    if (!ticketNo) return '-'
    if (ticketNo.startsWith('DAILY-MONITOR')) return 'Daily Monitor'
    if (ticketNo.startsWith('TEMUAN')) return 'Temuan'
    return '-'
  }

  // ============================================================
  // ACTIONS
  // ============================================================
  async function fetchSubmissions() {
    isLoading.value = true
    error.value = null

    try {
      const { data: res } = await monitoringApi.getSubmissionList()
      if (!res.success) throw new Error(res.message)

      submissions.value = res.data.map((item) => ({
        ...item,
        tipe: getTipeFromTicket(item.ticket_no),
      }))
    } catch (err) {
      error.value = err?.response?.data?.message || err.message || 'Gagal memuat data'
    } finally {
      isLoading.value = false
    }
  }

  // ============================================================
  // ACTIONS
  // ============================================================
  async function updateStatus(submissionId, status, catatan = '') {
    isUpdatingStatus.value = true
    updateStatusError.value = null

    try {
      const payload = { status }
      if (catatan.trim()) payload.catatan = catatan.trim()

      const { data: res } = await monitoringApi.updateSubmissionStatus(submissionId, payload)
      if (!res.success) throw new Error(res.message)

      // Update lokal — tidak perlu re-fetch semua
      const idx = submissions.value.findIndex((s) => s.id === submissionId)
      if (idx !== -1) {
        submissions.value[idx].status = status
        submissions.value[idx].catatan = catatan.trim() || null
      }

      return { success: true }
    } catch (err) {
      updateStatusError.value =
        err?.response?.data?.message || err.message || 'Gagal mengubah status'
      return { success: false, message: updateStatusError.value }
    } finally {
      isUpdatingStatus.value = false
    }
  }

  function setPage(page) {
    currentPage.value = page
  }

  function setPageSize(size) {
    pageSize.value = size
    currentPage.value = 1
  }

  // ============================================================
  // HELPERS — Parse detail response
  // ============================================================
  function parseDetailData(data) {
    const infoUmum = data.filter((item) => item.section === null)

    const sectionMap = {}
    data
      .filter((item) => item.section !== null)
      .forEach((item) => {
        if (!sectionMap[item.section]) sectionMap[item.section] = []
        sectionMap[item.section].push(item)
      })

    return {
      infoUmum,
      sections: Object.entries(sectionMap).map(([title, items]) => ({ title, items })),
    }
  }

  function isImageArray(value) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) && parsed.length > 0
    } catch {
      return false
    }
  }

  function parseImageIds(value) {
    try {
      return JSON.parse(value)
    } catch {
      return []
    }
  }

  // ============================================================
  // ACTIONS — Fetch Detail
  // ============================================================
  async function fetchSubmissionDetail(submissionId) {
    isLoadingDetail.value = true
    detailError.value = null
    currentDetail.value = null

    try {
      const { data: res } = await monitoringApi.getSubmissionDetail(submissionId)
      if (!res.success) throw new Error(res.message)
      currentDetail.value = parseDetailData(res.data)
    } catch (err) {
      detailError.value = err?.response?.data?.message || err.message || 'Gagal memuat detail'
    } finally {
      isLoadingDetail.value = false
    }
  }

  return {
    submissions,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalSubmissions,
    paginatedSubmissions,
    currentDetail,
    isLoadingDetail,
    detailError,
    isUpdatingStatus,
    updateStatusError,
    fetchSubmissionDetail,
    isImageArray,
    parseImageIds,
    fetchSubmissions,
    setPage,
    setPageSize,
    updateStatus,
  }
})
