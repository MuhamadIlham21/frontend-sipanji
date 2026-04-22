// ============================================================
// API LAYER — Monitoring Operasional Haji (SiPanji)
// ============================================================
import apiClient from './axios'

export const monitoringApi = {
  // ──────────────────────────────────────────────────────────
  // STEPPER 4 — Provinsi Embarkasi
  // ──────────────────────────────────────────────────────────
  // 🟢 Uncomment saat endpoint tersedia
  // getProvinsiEmbarkasi() {
  //   return apiClient.get('/embarkasi/provinsi')
  // },

  // ──────────────────────────────────────────────────────────
  // STEPPER 5 — Embarkasi by Provinsi
  // ──────────────────────────────────────────────────────────
  // 🟢 Uncomment saat endpoint tersedia
  // getEmbarkasiByProvinsi(provinsiId) {
  //   return apiClient.get(`/embarkasi?provinsiId=${provinsiId}`)
  // },

  // ──────────────────────────────────────────────────────────
  // STEPPER 6 — Pertanyaan per Accordion
  // ──────────────────────────────────────────────────────────
  // 🟢 Uncomment saat endpoint tersedia
  // getQuestions(accordionId) {
  //   return apiClient.get(`/monitoring/questions?accordionId=${accordionId}`)
  // },

  // ──────────────────────────────────────────────────────────
  // STEPPER 6 — Submit Jawaban (per Accordion)
  // ──────────────────────────────────────────────────────────
  submitMonev(requestData) {
    return apiClient.post('/monitoring/submit', requestData)
  },

  // ──────────────────────────────────────────────────────────
  // UPLOAD — File Bukti Pengawasan
  // ──────────────────────────────────────────────────────────
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/upload/minio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // ──────────────────────────────────────────────────────────
  // GET — Riwayat Submission (Admin)
  // ──────────────────────────────────────────────────────────
  getSubmissions(params = {}) {
    const query = new URLSearchParams({
      page: params.page || 1,
      size: params.limit || 10,
    })
    if (params.tab_id) query.append('tabId', params.tab_id)
    if (params.accordion_id) query.append('accordionId', params.accordion_id)
    if (params.date_from) query.append('startDate', params.date_from)
    if (params.date_to) query.append('endDate', params.date_to)
    return apiClient.get(`/monitoring/submissions?${query}`)
  },

  getSubmissionDetail(id) {
    return apiClient.get(`/monitoring/submissions/${id}`)
  },
}
