// ============================================================
// KONSTANTA SISTEM PENGENDALIAN OPERASIONAL HAJI (SiPanji)
// ============================================================

// ----------------------------------------------------------
// STEPPER 1 — Jenis Paket Haji
// ----------------------------------------------------------
export const JENIS_PAKET = [
  { value: 'reguler', label: 'Reguler' },
  { value: 'haji_khusus', label: 'Haji Khusus' },
]

// ----------------------------------------------------------
// STEPPER 2 — Jenis Kontributor
// ----------------------------------------------------------
export const JENIS_KONTRIBUTOR = [
  { value: 'petugas', label: 'Petugas' },
  { value: 'jemaah', label: 'Jemaah' },
  { value: 'lainnya', label: 'Lainnya' },
]

// ----------------------------------------------------------
// STEPPER 6 — Tab Pengawasan (Level 1)
// ----------------------------------------------------------
export const TAB_PENGAWASAN = [
  { id: '6.1', label: 'Transportasi Udara', shortLabel: 'Trans. Udara', icon: 'flight' },
  { id: '6.2', label: 'Transportasi Darat', shortLabel: 'Trans. Darat', icon: 'directions_bus' },
  { id: '6.3', label: 'Konsumsi', shortLabel: 'Konsumsi', icon: 'restaurant' },
  { id: '6.4', label: 'Akomodasi', shortLabel: 'Akomodasi', icon: 'hotel' },
  { id: '6.5', label: 'Masyair', shortLabel: 'Masyair', icon: 'mosque' },
  { id: '6.6', label: 'Perlindungan Jemaah', shortLabel: 'Perlindungan', icon: 'security' },
  { id: '6.7', label: 'Pemotongan DAM', shortLabel: 'DAM', icon: 'content_cut' },
]

// ----------------------------------------------------------
// STEPPER 6 — Accordion (Level 2)
// ----------------------------------------------------------
export const ACCORDION_PENGAWASAN = {
  '6.1': [
    { id: '6.1.1', label: 'Pengawasan Kedatangan Jemaah Haji di Bandara Jeddah/Madinah' },
    { id: '6.1.2', label: 'Pengawasan Kepulangan Jemaah Haji di Bandara Jeddah/Madinah' },
  ],
  '6.2': [
    { id: '6.2.1', label: 'Transportasi AKAP (Antar Kota Antar Provinsi)' },
    { id: '6.2.2', label: 'Transportasi Sholawat' },
  ],
  '6.3': [
    { id: '6.3.1', label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Bandara Jeddah' },
    { id: '6.3.2', label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Jeddah' },
    { id: '6.3.3', label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Madinah' },
    { id: '6.3.4', label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Madinah' },
    { id: '6.3.5', label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Makkah' },
    { id: '6.3.6', label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Makkah' },
    { id: '6.3.7', label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Armuzna' },
    { id: '6.3.8', label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Armuzna' },
  ],
  '6.4': [
    { id: '6.4.1', label: 'Pengawasan Kedatangan Jemaah Haji Reguler di Hotel Makkah/Madinah' },
    { id: '6.4.2', label: 'Pengawasan Kegiatan Jemaah selama di Hotel Makkah dan Madinah' },
    { id: '6.4.3', label: 'Pengawasan Kepulangan/Keberangkatan Jemaah Haji Reguler di Hotel Makkah/Madinah' },
  ],
  '6.5': [
    { id: '6.5.1', label: 'Pengawasan Kegiatan Pelayanan Jemaah Haji Reguler di Arafah' },
    { id: '6.5.2', label: 'Pengawasan Kegiatan Pelayanan Jemaah Haji Reguler di Muzdalifah' },
    { id: '6.5.3', label: 'Pengawasan Kegiatan Pelayanan Jemaah Haji Reguler di Mina' },
    { id: '6.5.4', label: 'Pengawasan Kegiatan Jemaah Haji Reguler di Jamarat' },
    { id: '6.5.5', label: 'Pengawasan Kegiatan Jemaah Menuju dan Kembali dari Jamarat' },
  ],
  '6.6': [
    { id: '6.6.1', label: 'Pengawasan Operasional Perlindungan Jemaah' },
  ],
  '6.7': [
    { id: '6.7.1', label: 'Pengawasan Pemotongan DAM' },
  ],
}

// ----------------------------------------------------------
// TIPE PERTANYAAN — Stepper 6
// ----------------------------------------------------------
export const TIPE_PERTANYAAN = {
  RADIO: 'radio',           // Pilihan tunggal (+ opsi "Lainnya" dengan input)
  CHECKBOX: 'checkbox',     // Multi-pilih
  TEXTAREA: 'textarea',     // Teks bebas / catatan
  FILE: 'file',             // Upload foto/dokumen bukti
  NUMBER: 'number',         // Input angka (jumlah jemaah, dll)
}

// ----------------------------------------------------------
// STEPS — Definisi Stepper Utama
// ----------------------------------------------------------
export const MONITORING_STEPS = [
  { id: 1, title: 'Jenis Paket', subtitle: 'Reguler / Haji Khusus', icon: 'luggage' },
  { id: 2, title: 'Kontributor', subtitle: 'Identitas pengisi', icon: 'person' },
  { id: 3, title: 'Lokasi', subtitle: 'Sektor pengawasan', icon: 'location_on' },
  { id: 4, title: 'Provinsi', subtitle: 'Asal daerah', icon: 'map' },
  { id: 5, title: 'Embarkasi', subtitle: 'Kota embarkasi', icon: 'flight_takeoff' },
  { id: 6, title: 'Monev', subtitle: 'Pengawasan & evaluasi', icon: 'assignment' },
]

// ----------------------------------------------------------
// LOCAL STORAGE KEY
// ----------------------------------------------------------
export const LS_KEY_FORM_STATE = 'sipanji_monitoring_form'
export const LS_KEY_STEP = 'sipanji_monitoring_step'
