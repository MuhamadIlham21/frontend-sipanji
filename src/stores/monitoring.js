// ============================================================
// PINIA STORE — Monitoring Operasional Haji (SiPanji)
// ============================================================
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { monitoringApi } from '@/api/monitoring-api'
import { DUMMY_QUESTIONS } from '@/data/monev-questions'
import { PROVINSI_EMBARKASI, EMBARKASI_BY_PROVINSI } from '@/data/embarkasi'
import { LS_KEY_FORM_STATE, LS_KEY_STEP } from '@/constants/monitoring'

export const useMonitoringStore = defineStore('monitoring', () => {
  // ══════════════════════════════════════════════════════════
  // STATE
  // ══════════════════════════════════════════════════════════

  const isLoading = ref(false)
  const isError = ref(false)
  const errorMessage = ref('')

  // Stepper navigation
  const currentStep = ref(0)

  // Form state — semua data dari 6 stepper
  const formState = ref({
    // Step 1
    jenis_paket: '',

    // Step 2
    jenis_kontributor: '',
    kontributor_lainnya: '',
    nama_lengkap: '',

    // Step 3 — { kuh: null, daker_bandara: null, daker_madinah: null, daker_mekkah: null }
    lokasi_pengawasan: {
      kuh: null,
      daker_bandara: null,
      daker_madinah: null,
      daker_mekkah: null,
    },

    // Step 4
    provinsi_id: '',
    provinsi_label: '',

    // Step 5
    embarkasi_id: '',
    embarkasi_label: '',

    // Step 6 — Monev
    active_tab: '6.1',
    active_accordion: null,
    // Jawaban tersimpan per accordion: { '6.1.1': { answers: {}, files: [] }, ... }
    monev_answers: {},
  })

  // Step 4 — Daftar provinsi
  const provinsiList = ref([])

  // Step 5 — Daftar embarkasi (filtered by provinsi)
  const embarkasi_list = ref([])

  // Step 6 — Pertanyaan aktif (array untuk accordion yang sedang dibuka)
  const activeQuestions = ref([])
  const isLoadingQuestions = ref(false)

  // Submit result
  const submitResult = ref(null)
  const showSuccessModal = ref(false)

  // ══════════════════════════════════════════════════════════
  // COMPUTED
  // ══════════════════════════════════════════════════════════

  const isStepValid = computed(() => (step) => {
    switch (step) {
      case 0:
        return !!formState.value.jenis_paket
      case 1:
        return (
          !!formState.value.jenis_kontributor &&
          !!formState.value.nama_lengkap.trim() &&
          (formState.value.jenis_kontributor !== 'lainnya' ||
            !!formState.value.kontributor_lainnya.trim())
        )
      case 2: {
        // Minimal 1 kolom lokasi dipilih
        const lokasi = formState.value.lokasi_pengawasan
        return Object.values(lokasi).some((v) => v !== null)
      }
      case 3:
        return !!formState.value.provinsi_id
      case 4:
        return !!formState.value.embarkasi_id
      default:
        return true
    }
  })

  const canProceed = computed(() => isStepValid.value(currentStep.value))

  const activeAccordionAnswers = computed(() => {
    const accordionId = formState.value.active_accordion
    if (!accordionId) return {}
    return formState.value.monev_answers[accordionId]?.answers || {}
  })

  const activeAccordionFiles = computed(() => {
    const accordionId = formState.value.active_accordion
    if (!accordionId) return []
    return formState.value.monev_answers[accordionId]?.files || []
  })

  // ══════════════════════════════════════════════════════════
  // ACTIONS — STEPPER NAVIGATION
  // ══════════════════════════════════════════════════════════

  const goToStep = (step) => {
    currentStep.value = step
    saveToLocalStorage()
  }

  const nextStep = () => {
    if (currentStep.value < 5) {
      currentStep.value++
      saveToLocalStorage()
    }
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
      saveToLocalStorage()
    }
  }

  // ══════════════════════════════════════════════════════════
  // ACTIONS — FORM STATE MUTATIONS
  // ══════════════════════════════════════════════════════════

  const setJenisPaket = (value) => {
    formState.value.jenis_paket = value
    saveToLocalStorage()
  }

  const setKontributor = (value) => {
    formState.value.jenis_kontributor = value
    if (value !== 'lainnya') {
      formState.value.kontributor_lainnya = ''
    }
    saveToLocalStorage()
  }

  const setKontributorLainnya = (value) => {
    formState.value.kontributor_lainnya = value
    saveToLocalStorage()
  }

  const setNamaLengkap = (value) => {
    formState.value.nama_lengkap = value
    saveToLocalStorage()
  }

  const setLokasi = (kolomId, barisId) => {
    formState.value.lokasi_pengawasan[kolomId] = barisId
    saveToLocalStorage()
  }

  const setProvinsi = (id, label) => {
    formState.value.provinsi_id = id
    formState.value.provinsi_label = label
    // Reset embarkasi saat provinsi berubah
    formState.value.embarkasi_id = ''
    formState.value.embarkasi_label = ''
    saveToLocalStorage()
  }

  const setEmbarkasi = (id, label) => {
    formState.value.embarkasi_id = id
    formState.value.embarkasi_label = label
    saveToLocalStorage()
  }

  const setActiveTab = (tabId) => {
    formState.value.active_tab = tabId
    formState.value.active_accordion = null
    activeQuestions.value = []
    saveToLocalStorage()
  }

  const setActiveAccordion = (accordionId) => {
    // Toggle: tutup jika sama
    if (formState.value.active_accordion === accordionId) {
      formState.value.active_accordion = null
      activeQuestions.value = []
    } else {
      formState.value.active_accordion = accordionId
      loadQuestions(accordionId)
    }
    saveToLocalStorage()
  }

  // ══════════════════════════════════════════════════════════
  // ACTIONS — STEP 4 & 5: PROVINSI & EMBARKASI
  // ══════════════════════════════════════════════════════════

  const fetchProvinsi = async () => {
    try {
      isLoading.value = true

      // ──────────────────────────────────────────────────────
      // 📦 VERSI INTERNAL (aktif sekarang)
      // ──────────────────────────────────────────────────────
      provinsiList.value = PROVINSI_EMBARKASI
      return provinsiList.value

      // ──────────────────────────────────────────────────────
      // 🟢 VERSI API — Uncomment saat endpoint tersedia
      // ──────────────────────────────────────────────────────
      // const response = await monitoringApi.getProvinsiEmbarkasi()
      // if (response.data.success) {
      //   provinsiList.value = response.data.data
      // }
      // return provinsiList.value
    } catch (error) {
      isError.value = true
      console.error('Failed to fetch provinsi:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const fetchEmbarkasiByProvinsi = async (provinsiId) => {
    try {
      isLoading.value = true

      // ──────────────────────────────────────────────────────
      // 📦 VERSI INTERNAL (aktif sekarang)
      // ──────────────────────────────────────────────────────
      embarkasi_list.value = EMBARKASI_BY_PROVINSI[provinsiId] || []
      return embarkasi_list.value

      // ──────────────────────────────────────────────────────
      // 🟢 VERSI API — Uncomment saat endpoint tersedia
      // ──────────────────────────────────────────────────────
      // const response = await monitoringApi.getEmbarkasiByProvinsi(provinsiId)
      // if (response.data.success) {
      //   embarkasi_list.value = response.data.data
      // }
      // return embarkasi_list.value
    } catch (error) {
      isError.value = true
      console.error('Failed to fetch embarkasi:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // ══════════════════════════════════════════════════════════
  // ACTIONS — STEP 6: QUESTIONS & ANSWERS
  // ══════════════════════════════════════════════════════════

  const loadQuestions = async (accordionId) => {
    try {
      isLoadingQuestions.value = true

      // ──────────────────────────────────────────────────────
      // 📦 VERSI DUMMY (aktif sekarang)
      // ──────────────────────────────────────────────────────
      await new Promise((resolve) => setTimeout(resolve, 200)) // simulasi loading
      activeQuestions.value = DUMMY_QUESTIONS[accordionId] || []

      // ──────────────────────────────────────────────────────
      // 🟢 VERSI API — Uncomment saat endpoint tersedia
      // ──────────────────────────────────────────────────────
      // const response = await monitoringApi.getQuestions(accordionId)
      // if (response.data.success) {
      //   activeQuestions.value = response.data.data
      // }
    } catch (error) {
      console.error('Failed to load questions:', error)
      activeQuestions.value = []
    } finally {
      isLoadingQuestions.value = false
    }
  }

  const setAnswer = (accordionId, questionId, value) => {
    if (!formState.value.monev_answers[accordionId]) {
      formState.value.monev_answers[accordionId] = { answers: {}, files: [] }
    }
    formState.value.monev_answers[accordionId].answers[questionId] = value
    saveToLocalStorage()
  }

  const setAnswerLainnya = (accordionId, questionId, value) => {
    if (!formState.value.monev_answers[accordionId]) {
      formState.value.monev_answers[accordionId] = { answers: {}, files: [] }
    }
    const key = `${questionId}_lainnya`
    formState.value.monev_answers[accordionId].answers[key] = value
    saveToLocalStorage()
  }

  const addFile = (accordionId, questionId, file) => {
    if (!formState.value.monev_answers[accordionId]) {
      formState.value.monev_answers[accordionId] = { answers: {}, files: [] }
    }
    formState.value.monev_answers[accordionId].files.push({ questionId, file })
  }

  const removeFile = (accordionId, questionId, index) => {
    if (!formState.value.monev_answers[accordionId]) return
    const files = formState.value.monev_answers[accordionId].files.filter(
      (f, i) => !(f.questionId === questionId && i === index),
    )
    formState.value.monev_answers[accordionId].files = files
  }

  // ══════════════════════════════════════════════════════════
  // ACTIONS — SUBMIT
  // ══════════════════════════════════════════════════════════

  const submitMonev = async () => {
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''

    const accordionId = formState.value.active_accordion

    try {
      // ─── Step 1: Upload semua file ─────────────────────────
      const accordionData = formState.value.monev_answers[accordionId] || {}
      const fileEntries = accordionData.files || []
      const uploadedFiles = []

      for (const entry of fileEntries) {
        const uploadResponse = await monitoringApi.uploadFile(entry.file)
        if (uploadResponse.data.success) {
          uploadedFiles.push({
            questionId: entry.questionId,
            object_name: uploadResponse.data.data.object_name,
          })
        }
      }

      // ─── Step 2: Build requestData ─────────────────────────
      const requestData = {
        // Metadata
        jenis_paket: formState.value.jenis_paket,
        jenis_kontributor: formState.value.jenis_kontributor,
        kontributor_lainnya: formState.value.kontributor_lainnya || null,
        nama_lengkap: formState.value.nama_lengkap,

        // Lokasi
        lokasi_pengawasan: formState.value.lokasi_pengawasan,

        // Wilayah
        provinsi_id: formState.value.provinsi_id,
        embarkasi_id: formState.value.embarkasi_id,

        // Monev
        tab_id: formState.value.active_tab,
        accordion_id: accordionId,

        // Jawaban
        jawaban: accordionData.answers || {},

        // File paths dari MinIO
        dokumen_bukti: uploadedFiles,
      }

      const response = await monitoringApi.submitMonev(requestData)

      if (response.data.success) {
        submitResult.value = response.data.data
        showSuccessModal.value = true
        clearLocalStorage()
        return { success: true, data: response.data.data }
      }

      throw new Error(response.data.message || 'Gagal mengirim data monitoring')
    } catch (error) {
      isError.value = true
      errorMessage.value =
        error.response?.data?.message || error.message || 'Gagal mengirim data monitoring'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // ══════════════════════════════════════════════════════════
  // ACTIONS — LOCAL STORAGE
  // ══════════════════════════════════════════════════════════

  const saveToLocalStorage = () => {
    try {
      const snapshot = {
        currentStep: currentStep.value,
        formState: {
          ...formState.value,
          // File tidak bisa di-serialize, kosongkan
          monev_answers: Object.fromEntries(
            Object.entries(formState.value.monev_answers).map(([k, v]) => [
              k,
              { answers: v.answers, files: [] },
            ]),
          ),
        },
      }
      localStorage.setItem(LS_KEY_FORM_STATE, JSON.stringify(snapshot))
    } catch (e) {
      console.warn('Failed to save to localStorage:', e)
    }
  }

  const restoreFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(LS_KEY_FORM_STATE)
      if (!stored) return false

      const snapshot = JSON.parse(stored)

      if (snapshot.currentStep !== undefined) {
        currentStep.value = snapshot.currentStep
      }

      if (snapshot.formState) {
        Object.assign(formState.value, snapshot.formState)
      }

      // Restore embarkasi list jika ada provinsi tersimpan
      if (formState.value.provinsi_id) {
        fetchEmbarkasiByProvinsi(formState.value.provinsi_id)
      }

      // Restore pertanyaan jika ada accordion aktif
      if (formState.value.active_accordion) {
        loadQuestions(formState.value.active_accordion)
      }

      return true
    } catch (e) {
      console.warn('Failed to restore from localStorage:', e)
      return false
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem(LS_KEY_FORM_STATE)
    localStorage.removeItem(LS_KEY_STEP)
  }

  // ══════════════════════════════════════════════════════════
  // ACTIONS — RESET
  // ══════════════════════════════════════════════════════════

  const resetForm = () => {
    currentStep.value = 0
    formState.value = {
      jenis_paket: '',
      jenis_kontributor: '',
      kontributor_lainnya: '',
      nama_lengkap: '',
      lokasi_pengawasan: {
        kuh: null,
        daker_bandara: null,
        daker_madinah: null,
        daker_mekkah: null,
      },
      provinsi_id: '',
      provinsi_label: '',
      embarkasi_id: '',
      embarkasi_label: '',
      active_tab: '6.1',
      active_accordion: null,
      monev_answers: {},
    }
    activeQuestions.value = []
    submitResult.value = null
    showSuccessModal.value = false
    embarkasi_list.value = []
    clearLocalStorage()
  }

  // ══════════════════════════════════════════════════════════
  // EXPOSE
  // ══════════════════════════════════════════════════════════
  return {
    // State
    isLoading,
    isError,
    errorMessage,
    currentStep,
    formState,
    provinsiList,
    embarkasi_list,
    activeQuestions,
    isLoadingQuestions,
    submitResult,
    showSuccessModal,

    // Computed
    isStepValid,
    canProceed,
    activeAccordionAnswers,
    activeAccordionFiles,

    // Stepper navigation
    goToStep,
    nextStep,
    prevStep,

    // Form mutations
    setJenisPaket,
    setKontributor,
    setKontributorLainnya,
    setNamaLengkap,
    setLokasi,
    setProvinsi,
    setEmbarkasi,
    setActiveTab,
    setActiveAccordion,

    // Answers
    setAnswer,
    setAnswerLainnya,
    addFile,
    removeFile,

    // API
    fetchProvinsi,
    fetchEmbarkasiByProvinsi,
    loadQuestions,
    submitMonev,

    // localStorage
    saveToLocalStorage,
    restoreFromLocalStorage,
    clearLocalStorage,

    // Reset
    resetForm,
  }
})
