import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { monitoringApi } from '@/api/monitoring-api'
import { MONITORING_FORM_ID, MONITORING_STEPS } from '@/constants/monitoring'

export const useMonitoringStore = defineStore('monitoring', () => {

  // ============================================================
  // STATE — Loading & Error
  // ============================================================
  const isLoadingForm  = ref(false)
  const isLoadingMonev = ref(false)
  const isLoadingEmb   = ref(false)
  const formLoadError  = ref(null)
  const monevLoadError = ref(null)

  // ============================================================
  // STATE — Options Step 1–6 (dari /questions/:formId)
  // ============================================================
  const paketOptions       = ref([])
  const kontributorOptions = ref([])
  const sektorOptions      = ref([])
  const lokasiOptions      = ref([])
  const tindakanOptions    = ref([])

  // Step 4 & 5 — dari API master terpisah (tidak ada UUID)
  const provinsiOptions  = ref([])  // { label, value }
  const embarkasiOptions = ref([])  // { label, value }

  // Meta question ID (untuk payload submit)
  const questionMeta = ref({
    paket_id:       '',
    kontributor_id: '',
    sektor_id_q:    '',
    lokasi_id_q:    '',
    provinsi_id_q:  '',
    embarkasi_id_q: '',
    tindakan_id_q:  '',
  })

  // ============================================================
  // STATE — Monev Data (Step 7)
  // Struktur: { tabs: [ { id, label, sections: [ { id, label, questions: [] } ] } ] }
  // ============================================================
  const monevTabs = ref([])

  // ============================================================
  // STATE — Form State
  // ============================================================
  const formState = ref({
    // Step 1
    paket_id: '', paket_label: '', paket_value: '',

    // Step 2
    kontributor_id:     '',
    kontributor_label:  '',
    kontributor_value:  '',
    kontributor_lainnya: '',
    nama_lengkap:       '',
    identitas:          '',

    // Step 3
    sektor_id: '', sektor_label: '', sektor_value: '',
    lokasi_id: '', lokasi_label: '', lokasi_value: '',

    // Step 4 — value-based (tidak ada UUID dari API)
    provinsi_value: '', provinsi_label: '',

    // Step 5 — value-based, dependen provinsi
    embarkasi_value: '', embarkasi_label: '',

    // Step 6
    tindakan_id: '', tindakan_label: '', tindakan_value: '',

    // Step 7 — { [sectionId]: { [questionId]: value } }
    monev_answers: {},
  })

  // ============================================================
  // STATE — Stepper
  // ============================================================
  const currentStep = ref(1)
  const totalSteps  = computed(() => MONITORING_STEPS.length)
  const isLastStep  = computed(() => currentStep.value === totalSteps.value)
  const isFirstStep = computed(() => currentStep.value === 1)

  // ============================================================
  // STATE — Submit
  // ============================================================
  const isSubmitting             = ref(false)
  const submitError              = ref(null)
  const submitSuccess            = ref(false)
  const lastSubmittedSectionId   = ref(null)
  // Track section mana saja yang sudah di-submit
  const submittedSections        = ref(new Set())

  // ============================================================
  // ACTION — Fetch Form Questions (Step 1–6)
  // ============================================================
  async function fetchFormData() {
    if (paketOptions.value.length > 0) return

    isLoadingForm.value = true
    formLoadError.value = null

    try {
      const [formRes, provinsiRes] = await Promise.all([
        monitoringApi.getFormQuestions(MONITORING_FORM_ID),
        monitoringApi.getProvinsi(),
      ])

      if (!formRes.data.success)     throw new Error(formRes.data.message)
      if (!provinsiRes.data.success) throw new Error(provinsiRes.data.message)

      _parseFormQuestions(formRes.data.data)

      // Provinsi — tidak ada UUID, langsung pakai label+value
      provinsiOptions.value = provinsiRes.data.data.map((p) => ({
        label: p.label,
        value: p.value,
      }))
    } catch (err) {
      formLoadError.value = err?.response?.data?.message || err.message || 'Gagal memuat data form'
    } finally {
      isLoadingForm.value = false
    }
  }

  function _parseFormQuestions(items) {
    items.forEach((item) => {
      if (item.type !== 'question') return
      const opts = _mapOptions(item.options || [])

      switch (item.step_no) {
        case 1:
          paketOptions.value = opts
          questionMeta.value.paket_id = item.id
          break
        case 2:
          kontributorOptions.value = opts
          questionMeta.value.kontributor_id = item.id
          break
        case 3:
          if (item.order_no === 3) {
            sektorOptions.value = opts
            questionMeta.value.sektor_id_q = item.id
          } else if (item.order_no === 4) {
            lokasiOptions.value = opts
            questionMeta.value.lokasi_id_q = item.id
          }
          break
        case 4:
          // Options kosong — dari /master/provinsi
          questionMeta.value.provinsi_id_q = item.id
          break
        case 5:
          // Options kosong — dari /master/embarkasi/:provinsi
          questionMeta.value.embarkasi_id_q = item.id
          break
        case 6:
          tindakanOptions.value = opts
          questionMeta.value.tindakan_id_q = item.id
          break
      }
    })
  }

  function _mapOptions(rawOptions) {
    return rawOptions
      .slice()
      .sort((a, b) => a.order_no - b.order_no)
      .map((o) => ({ id: o.id, label: o.label, value: o.value, order_no: o.order_no }))
  }

  // ============================================================
  // ACTION — Fetch Embarkasi (dependen provinsi)
  // ============================================================
  async function fetchEmbarkasi(provinsiValue) {
    if (!provinsiValue) {
      embarkasiOptions.value = []
      return
    }

    isLoadingEmb.value = true
    try {
      const { data: res } = await monitoringApi.getEmbarkasi(provinsiValue)
      if (!res.success) throw new Error(res.message)
      embarkasiOptions.value = res.data.map((e) => ({ label: e.label, value: e.value }))
    } catch (err) {
      embarkasiOptions.value = []
      console.error('Gagal fetch embarkasi:', err.message)
    } finally {
      isLoadingEmb.value = false
    }
  }

  // ============================================================
  // ACTION — Fetch Monev Questions (Step 7)
  // Dipanggil saat user masuk Step 7, berdasarkan tindakan_value
  // ============================================================
  async function fetchMonevData() {
    const tindakan = formState.value.tindakan_value
    if (!tindakan) return

    // Sudah di-fetch untuk tindakan ini → skip
    if (monevTabs.value.length > 0 && _lastFetchedTindakan === tindakan) return

    isLoadingMonev.value = true
    monevLoadError.value = null
    _lastFetchedTindakan = tindakan

    try {
      // Map tindakan_value → endpoint segment
      const endpoint = tindakan === 'daily_monitor' ? 'daily-monitor' : tindakan
      const { data: res } = await monitoringApi.getMonevQuestions(MONITORING_FORM_ID, endpoint)
      if (!res.success) throw new Error(res.message)
      _parseMonevData(res.data)
    } catch (err) {
      monevLoadError.value = err?.response?.data?.message || err.message || 'Gagal memuat pertanyaan'
      monevTabs.value = []
    } finally {
      isLoadingMonev.value = false
    }
  }

  let _lastFetchedTindakan = null

  function _parseMonevData(data) {
    // Struktur: data[0] = group → children = tabs → children = sections → children = questions
    const group = data.find((item) => item.type === 'group')
    if (!group) {
      // Fallback: temuan — flat array of questions (tidak ada tab/section)
      monevTabs.value = [{
        id:       'temuan',
        label:    'Temuan',
        sections: [{
          id:        'temuan-section',
          label:     'Formulir Temuan',
          questions: data
            .filter((q) => q.type === 'question')
            .sort((a, b) => a.order_no - b.order_no),
        }],
      }]
      return
    }

    monevTabs.value = (group.children || [])
      .filter((tab) => tab.type === 'tab')
      .sort((a, b) => a.order_no - b.order_no)
      .map((tab) => ({
        id:    tab.id,
        label: tab.label,
        sections: (tab.children || [])
          .filter((s) => s.type === 'section')
          .sort((a, b) => a.order_no - b.order_no)
          .map((section) => ({
            id:        section.id,
            label:     section.label,
            questions: (section.children || [])
              .filter((q) => q.type === 'question')
              .sort((a, b) => a.order_no - b.order_no),
          })),
      }))
  }

  // ============================================================
  // ACTION — Setters
  // ============================================================
  function setPaket(option) {
    formState.value.paket_id    = option.id
    formState.value.paket_label = option.label
    formState.value.paket_value = option.value
  }

  function setKontributor(option) {
    formState.value.kontributor_id    = option.id
    formState.value.kontributor_label = option.label
    formState.value.kontributor_value = option.value
  }

  function setKontributorLainnya(val) {
    formState.value.kontributor_lainnya = val
  }

  function setNamaLengkap(val) {
    formState.value.nama_lengkap = val
  }

  function setIdentitas(val) {
    formState.value.identitas = val
  }

  function setSektor(option) {
    formState.value.sektor_id    = option.id
    formState.value.sektor_label = option.label
    formState.value.sektor_value = option.value
  }

  function setLokasi(option) {
    formState.value.lokasi_id    = option.id
    formState.value.lokasi_label = option.label
    formState.value.lokasi_value = option.value
  }

  function setProvinsi(option) {
    formState.value.provinsi_value = option.value
    formState.value.provinsi_label = option.label
    // Reset embarkasi saat provinsi berubah
    formState.value.embarkasi_value = ''
    formState.value.embarkasi_label = ''
    embarkasiOptions.value = []
    // Fetch embarkasi baru
    fetchEmbarkasi(option.value)
  }

  function setEmbarkasi(option) {
    formState.value.embarkasi_value = option.value
    formState.value.embarkasi_label = option.label
  }

  function setTindakan(option) {
    // Jika tindakan berubah, reset monev data & jawaban
    if (formState.value.tindakan_value !== option.value) {
      monevTabs.value = []
      formState.value.monev_answers = {}
      submittedSections.value = new Set()
      _lastFetchedTindakan = null
    }
    formState.value.tindakan_id    = option.id
    formState.value.tindakan_label = option.label
    formState.value.tindakan_value = option.value
  }

  function setMonevAnswer(sectionId, questionId, value) {
    if (!formState.value.monev_answers[sectionId]) {
      formState.value.monev_answers[sectionId] = {}
    }
    formState.value.monev_answers[sectionId][questionId] = value
  }

  function clearMonevSection(sectionId) {
    delete formState.value.monev_answers[sectionId]
  }

  // ============================================================
  // COMPUTED — Validasi per Step
  // ============================================================
  const isStepValid = computed(() => {
    const f = formState.value
    return {
      1: !!f.paket_id,
      2: !!f.kontributor_id &&
         f.nama_lengkap.trim().length >= 3 &&
         f.identitas.trim().length >= 6,
      3: !!f.sektor_id && !!f.lokasi_id,
      4: !!f.provinsi_value,
      5: !!f.embarkasi_value,
      6: !!f.tindakan_id,
      7: true, // validasi per section di accordion
    }
  })

  const isCurrentStepValid = computed(
    () => isStepValid.value[currentStep.value] ?? false
  )

  // ============================================================
  // ACTION — Navigasi
  // ============================================================
  function nextStep() {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++
      // Auto-fetch monev saat masuk step 7
      if (currentStep.value === 7) fetchMonevData()
    }
  }

  function prevStep() {
    if (currentStep.value > 1) currentStep.value--
  }

  function goToStep(n) {
    if (n >= 1 && n <= totalSteps.value) {
      currentStep.value = n
      if (n === 7) fetchMonevData()
    }
  }

  // ============================================================
  // ACTION — Build Payload
  // ============================================================
  function buildPayload(sectionId = null) {
    const f    = formState.value
    const meta = questionMeta.value

    const baseAnswers = [
      { question_id: meta.paket_id,      option_id: f.paket_id,      value: f.paket_value },
      { question_id: meta.kontributor_id, option_id: f.kontributor_id, value: f.kontributor_value },
      { question_id: meta.sektor_id_q,   option_id: f.sektor_id,     value: f.sektor_value },
      { question_id: meta.lokasi_id_q,   option_id: f.lokasi_id,     value: f.lokasi_value },
      // Provinsi & Embarkasi — tidak ada option_id (value-based)
      { question_id: meta.provinsi_id_q,  option_id: null, value: f.provinsi_value },
      { question_id: meta.embarkasi_id_q, option_id: null, value: f.embarkasi_value },
      { question_id: meta.tindakan_id_q,  option_id: f.tindakan_id, value: f.tindakan_value },
    ]

    const base = {
      form_id:      MONITORING_FORM_ID,
      nama_lengkap: f.nama_lengkap,
      identitas:    f.identitas,
      answers:      baseAnswers,
    }

    if (sectionId) {
      return {
        ...base,
        section_id:    sectionId,
        monev_answers: f.monev_answers[sectionId] || {},
      }
    }

    return { ...base, monev_answers: f.monev_answers }
  }

  // ============================================================
  // ACTION — Submit
  // ============================================================
  async function submitMonev(sectionId) {
    isSubmitting.value  = true
    submitError.value   = null
    submitSuccess.value = false

    try {
      const payload = buildPayload(sectionId)
      await monitoringApi.submitMonev(payload)
      submittedSections.value.add(sectionId)
      lastSubmittedSectionId.value = sectionId
      submitSuccess.value = true
    } catch (err) {
      submitError.value = err?.response?.data?.message || err.message || 'Gagal menyimpan data'
      throw err
    } finally {
      isSubmitting.value = false
    }
  }

  function isSectionSubmitted(sectionId) {
    return submittedSections.value.has(sectionId)
  }

  // ============================================================
  // ACTION — Upload File
  // ============================================================
  async function uploadFile(file) {
    try {
      const { data: res } = await monitoringApi.uploadFile(file)
      return res.data?.url || res.url || null
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Gagal mengupload file')
    }
  }

  async function uploadFiles(files) {
    try {
      return await monitoringApi.uploadFiles(files)
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Gagal mengupload file')
    }
  }

  // ============================================================
  // ACTION — Reset
  // ============================================================
  function resetForm() {
    formState.value = {
      paket_id: '', paket_label: '', paket_value: '',
      kontributor_id: '', kontributor_label: '', kontributor_value: '',
      kontributor_lainnya: '', nama_lengkap: '', identitas: '',
      sektor_id: '', sektor_label: '', sektor_value: '',
      lokasi_id: '', lokasi_label: '', lokasi_value: '',
      provinsi_value: '', provinsi_label: '',
      embarkasi_value: '', embarkasi_label: '',
      tindakan_id: '', tindakan_label: '', tindakan_value: '',
      monev_answers: {},
    }
    currentStep.value        = 1
    monevTabs.value          = []
    submittedSections.value  = new Set()
    submitSuccess.value      = false
    submitError.value        = null
    embarkasiOptions.value   = []
    _lastFetchedTindakan     = null
  }

  // ============================================================
  // EXPOSE
  // ============================================================
  return {
    // Loading
    isLoadingForm, isLoadingMonev, isLoadingEmb,
    formLoadError, monevLoadError,

    // Options
    paketOptions, kontributorOptions,
    sektorOptions, lokasiOptions,
    provinsiOptions, embarkasiOptions,
    tindakanOptions, questionMeta,

    // Monev
    monevTabs,

    // Form state
    formState,

    // Stepper
    currentStep, totalSteps, isLastStep, isFirstStep,

    // Submit state
    isSubmitting, submitError, submitSuccess,
    lastSubmittedSectionId, submittedSections,

    // Validasi
    isStepValid, isCurrentStepValid,

    // Actions
    fetchFormData, fetchMonevData, fetchEmbarkasi,
    setPaket, setKontributor, setKontributorLainnya, setNamaLengkap,
    setIdentitas, setSektor, setLokasi,
    setProvinsi, setEmbarkasi, setTindakan,
    setMonevAnswer, clearMonevSection,
    buildPayload, submitMonev, isSectionSubmitted,
    uploadFile, uploadFiles,
    nextStep, prevStep, goToStep,
    resetForm,
  }
})