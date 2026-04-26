import apiClient from './axios'

export const monitoringApi = {
  // ── Form Questions (Step 1–6) ──────────────────────────────
  getFormQuestions(formId) {
    return apiClient.get(`/questions/${formId}`)
  },

  // ── Monev Questions (Step 7) ───────────────────────────────
  // tindakan: 'daily-monitor' | 'temuan'
  getMonevQuestions(formId, tindakan) {
    return apiClient.get(`/questions/${formId}/${tindakan}`)
  },

  // ── Master Data ────────────────────────────────────────────
  getProvinsi() {
    return apiClient.get('/master/provinsi')
  },

  getEmbarkasi(provinsiValue) {
    return apiClient.get(`/master/embarkasi/${provinsiValue}`)
  },

  // ── Submit ─────────────────────────────────────────────────
  submitMonev(payload) {
    return apiClient.post('/submission', payload) // ✅
  },

  // ── Upload (multiple) ──────────────────────────────────────
  uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/upload', formData, {
      // ✅
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // ── Riwayat (Admin) ────────────────────────────────────────
  getSubmissions(params = {}) {
    const query = new URLSearchParams({ page: params.page || 1, size: params.limit || 10 })
    if (params.tab_id) query.append('tabId', params.tab_id)
    if (params.section_id) query.append('sectionId', params.section_id)
    if (params.date_from) query.append('startDate', params.date_from)
    if (params.date_to) query.append('endDate', params.date_to)
    return apiClient.get(`/monitoring/submissions?${query}`)
  },

  getSubmissionDetail(id) {
    return apiClient.get(`/monitoring/submissions/${id}`)
  },
}
