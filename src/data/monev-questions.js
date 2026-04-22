// ============================================================
// DUMMY DATA — Pertanyaan Monev per Accordion (Stepper 6)
// ============================================================
// CATATAN: Data ini adalah dummy statis untuk development.
// Struktur mengikuti kontrak API yang diharapkan.
// Ganti fetchQuestions() di monitoring-api.js saat API ready.
//
// Struktur per pertanyaan:
// {
//   id: number,
//   teks: string,               — teks pertanyaan
//   tipe: TIPE_PERTANYAAN,      — 'radio'|'checkbox'|'textarea'|'file'|'number'
//   required: boolean,
//   opsi?: string[],            — untuk tipe radio/checkbox
//   ada_opsi_lainnya?: boolean, — untuk radio/checkbox dengan input "Lainnya"
//   satuan?: string,            — untuk tipe number (misal: 'jemaah', 'unit')
//   accept?: string,            — untuk tipe file (misal: 'image/*,.pdf')
//   max_files?: number,         — untuk tipe file
// }
// ============================================================

import { TIPE_PERTANYAAN } from '@/constants/monitoring'

export const DUMMY_QUESTIONS = {
  // ─── 6.1 TRANSPORTASI UDARA ────────────────────────────────
  '6.1.1': [
    {
      id: 1,
      teks: 'Apakah proses kedatangan jemaah di bandara berjalan sesuai prosedur?',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sesuai', 'Kurang Sesuai', 'Tidak Sesuai'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Kendala yang ditemukan saat proses kedatangan',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Delay penerbangan', 'Antrean panjang imigrasi', 'Koper hilang/rusak', 'Jemaah sakit'],
      ada_opsi_lainnya: true,
    },
    {
      id: 3,
      teks: 'Jumlah jemaah yang tiba',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'jemaah',
    },
    {
      id: 4,
      teks: 'Catatan tambahan kondisi kedatangan',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 5,
      teks: 'Upload foto dokumentasi kedatangan',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*,.pdf',
      max_files: 3,
    },
  ],
  '6.1.2': [
    {
      id: 1,
      teks: 'Apakah proses kepulangan jemaah dari bandara berjalan sesuai prosedur?',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sesuai', 'Kurang Sesuai', 'Tidak Sesuai'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Kendala yang ditemukan saat kepulangan',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Delay penerbangan', 'Bagasi melebihi kapasitas', 'Jemaah tidak hadir', 'Masalah dokumen'],
      ada_opsi_lainnya: true,
    },
    {
      id: 3,
      teks: 'Jumlah jemaah yang berangkat pulang',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'jemaah',
    },
    {
      id: 4,
      teks: 'Catatan proses kepulangan',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 5,
      teks: 'Upload foto dokumentasi kepulangan',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*,.pdf',
      max_files: 3,
    },
  ],

  // ─── 6.2 TRANSPORTASI DARAT ───────────────────────────────
  '6.2.1': [
    {
      id: 1,
      teks: 'Kondisi armada transportasi AKAP',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Apakah jadwal keberangkatan AKAP tepat waktu?',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Tepat Waktu', 'Terlambat < 30 menit', 'Terlambat > 30 menit'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Permasalahan transportasi AKAP',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['AC tidak berfungsi', 'Kursi tidak memadai', 'Sopir tidak profesional', 'Rute salah'],
      ada_opsi_lainnya: true,
    },
    {
      id: 4,
      teks: 'Catatan kondisi transportasi AKAP',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 5,
      teks: 'Upload foto armada',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.2.2': [
    {
      id: 1,
      teks: 'Kondisi bus Sholawat',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Frekuensi ketersediaan bus Sholawat',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sangat Memadai', 'Memadai', 'Tidak Memadai'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Masalah pada bus Sholawat',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Overload penumpang', 'AC rusak', 'Jadwal tidak teratur', 'Rute berubah'],
      ada_opsi_lainnya: true,
    },
    {
      id: 4,
      teks: 'Catatan pengawasan bus Sholawat',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],

  // ─── 6.3 KONSUMSI ──────────────────────────────────────────
  '6.3.1': [
    {
      id: 1,
      teks: 'Kondisi kebersihan dapur di wilayah Bandara Jeddah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Bersih', 'Cukup Bersih', 'Kotor'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Kepatuhan terhadap standar higienitas',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sangat Patuh', 'Patuh', 'Kurang Patuh', 'Tidak Patuh'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Jumlah porsi yang diproduksi',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'porsi',
    },
    {
      id: 4,
      teks: 'Temuan pelanggaran higienitas',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Bahan baku kadaluarsa', 'Tidak menggunakan APD', 'Kontaminasi silang', 'Suhu penyimpanan tidak sesuai'],
      ada_opsi_lainnya: true,
    },
    {
      id: 5,
      teks: 'Catatan kondisi dapur',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 6,
      teks: 'Dokumentasi foto dapur',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.3.2': [
    {
      id: 1,
      teks: 'Ketepatan distribusi konsumsi di wilayah Jeddah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Tepat Waktu', 'Terlambat < 30 menit', 'Terlambat > 30 menit'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Kesesuaian jumlah porsi dengan jumlah jemaah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sesuai', 'Kurang', 'Berlebih'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Catatan distribusi',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi distribusi',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 3,
    },
  ],
  '6.3.3': [
    {
      id: 1,
      teks: 'Kondisi kebersihan dapur di wilayah Madinah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Bersih', 'Cukup Bersih', 'Kotor'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Jumlah porsi diproduksi',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'porsi',
    },
    {
      id: 3,
      teks: 'Catatan dapur Madinah',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi foto',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.3.4': [
    {
      id: 1,
      teks: 'Ketepatan distribusi konsumsi di wilayah Madinah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Tepat Waktu', 'Terlambat < 30 menit', 'Terlambat > 30 menit'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Catatan distribusi Madinah',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],
  '6.3.5': [
    {
      id: 1,
      teks: 'Kondisi kebersihan dapur di wilayah Makkah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Bersih', 'Cukup Bersih', 'Kotor'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Jumlah porsi diproduksi',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'porsi',
    },
    {
      id: 3,
      teks: 'Catatan dapur Makkah',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi foto',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.3.6': [
    {
      id: 1,
      teks: 'Ketepatan distribusi konsumsi di wilayah Makkah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Tepat Waktu', 'Terlambat < 30 menit', 'Terlambat > 30 menit'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Catatan distribusi Makkah',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],
  '6.3.7': [
    {
      id: 1,
      teks: 'Kondisi dapur di wilayah Armuzna',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Jumlah porsi diproduksi',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'porsi',
    },
    {
      id: 3,
      teks: 'Catatan dapur Armuzna',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi foto',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.3.8': [
    {
      id: 1,
      teks: 'Ketepatan distribusi di wilayah Armuzna',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Tepat Waktu', 'Terlambat < 30 menit', 'Terlambat > 30 menit'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Catatan distribusi Armuzna',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],

  // ─── 6.4 AKOMODASI ─────────────────────────────────────────
  '6.4.1': [
    {
      id: 1,
      teks: 'Proses check-in jemaah di hotel',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Lancar', 'Agak Lambat', 'Terhambat'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Kesesuaian kamar dengan manifest jemaah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sesuai', 'Tidak Sesuai'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Jumlah jemaah yang check-in',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'jemaah',
    },
    {
      id: 4,
      teks: 'Catatan kedatangan di hotel',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 5,
      teks: 'Dokumentasi hotel',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.4.2': [
    {
      id: 1,
      teks: 'Kualitas pelayanan hotel selama menginap',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Keluhan jemaah selama di hotel',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['AC bermasalah', 'Kebersihan kamar', 'Konsumsi tidak sesuai', 'Lift tidak berfungsi'],
      ada_opsi_lainnya: true,
    },
    {
      id: 3,
      teks: 'Catatan kegiatan di hotel',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],
  '6.4.3': [
    {
      id: 1,
      teks: 'Proses check-out dan keberangkatan jemaah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Lancar', 'Agak Lambat', 'Terhambat'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Jumlah jemaah yang berangkat',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'jemaah',
    },
    {
      id: 3,
      teks: 'Catatan kepulangan dari hotel',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],

  // ─── 6.5 MASYAIR ───────────────────────────────────────────
  '6.5.1': [
    {
      id: 1,
      teks: 'Kondisi pelayanan jemaah di Arafah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Ketersediaan fasilitas di Arafah',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Tenda memadai', 'Air bersih tersedia', 'Toilet mencukupi', 'Tenaga medis standby'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Catatan kondisi di Arafah',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi foto Arafah',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.5.2': [
    {
      id: 1,
      teks: 'Kondisi pelayanan di Muzdalifah',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Catatan kondisi di Muzdalifah',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],
  '6.5.3': [
    {
      id: 1,
      teks: 'Kondisi pelayanan di Mina',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sangat Baik', 'Baik', 'Cukup', 'Kurang Baik'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Ketersediaan fasilitas di Mina',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Tenda memadai', 'Konsumsi tersedia', 'Toilet mencukupi', 'Tenaga medis standby'],
      ada_opsi_lainnya: false,
    },
    {
      id: 3,
      teks: 'Catatan kondisi di Mina',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi foto Mina',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
  '6.5.4': [
    {
      id: 1,
      teks: 'Kondisi kegiatan jemaah di Jamarat',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Tertib', 'Cukup Tertib', 'Tidak Tertib'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Catatan kegiatan di Jamarat',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],
  '6.5.5': [
    {
      id: 1,
      teks: 'Kelancaran mobilisasi jemaah menuju dan dari Jamarat',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Lancar', 'Cukup Lancar', 'Terhambat'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Hambatan yang ditemui',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Kepadatan massa', 'Cuaca ekstrem', 'Jemaah terpisah', 'Transportasi terlambat'],
      ada_opsi_lainnya: true,
    },
    {
      id: 3,
      teks: 'Catatan mobilisasi Jamarat',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
  ],

  // ─── 6.6 PERLINDUNGAN JEMAAH ──────────────────────────────
  '6.6.1': [
    {
      id: 1,
      teks: 'Kondisi keamanan dan keselamatan jemaah secara umum',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sangat Aman', 'Aman', 'Cukup Aman', 'Tidak Aman'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Insiden yang terjadi',
      tipe: TIPE_PERTANYAAN.CHECKBOX,
      required: false,
      opsi: ['Jemaah hilang', 'Kecelakaan', 'Tindak kriminal', 'Jemaah sakit kritis'],
      ada_opsi_lainnya: true,
    },
    {
      id: 3,
      teks: 'Tindakan yang telah diambil',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 4,
      teks: 'Dokumentasi insiden (jika ada)',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*,.pdf',
      max_files: 4,
    },
  ],

  // ─── 6.7 PEMOTONGAN DAM ────────────────────────────────────
  '6.7.1': [
    {
      id: 1,
      teks: 'Proses pemotongan DAM berjalan sesuai syariat',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Sesuai', 'Kurang Sesuai', 'Tidak Sesuai'],
      ada_opsi_lainnya: false,
    },
    {
      id: 2,
      teks: 'Jumlah hewan yang dipotong',
      tipe: TIPE_PERTANYAAN.NUMBER,
      required: true,
      satuan: 'ekor',
    },
    {
      id: 3,
      teks: 'Jenis hewan DAM',
      tipe: TIPE_PERTANYAAN.RADIO,
      required: true,
      opsi: ['Kambing', 'Sapi', 'Unta'],
      ada_opsi_lainnya: false,
    },
    {
      id: 4,
      teks: 'Catatan pemotongan DAM',
      tipe: TIPE_PERTANYAAN.TEXTAREA,
      required: false,
    },
    {
      id: 5,
      teks: 'Dokumentasi foto pemotongan',
      tipe: TIPE_PERTANYAAN.FILE,
      required: false,
      accept: 'image/*',
      max_files: 4,
    },
  ],
}

// ============================================================
// 🟢 VERSI API — Uncomment saat endpoint tersedia
// ============================================================
// Ganti DUMMY_QUESTIONS dengan fetch dari API:
//
// import { monitoringApi } from '@/api/monitoring-api'
//
// export const fetchQuestionsByAccordion = async (accordionId) => {
//   const response = await monitoringApi.getQuestions(accordionId)
//   if (response.data.success) {
//     return response.data.data  // array of question objects
//   }
//   return []
// }
//
// Struktur respons API yang diharapkan:
// GET /monitoring/questions?accordionId=6.1.1
// {
//   "success": true,
//   "data": [
//     {
//       "id": 1,
//       "teks": "...",
//       "tipe": "radio",
//       "required": true,
//       "opsi": ["...", "..."],
//       "ada_opsi_lainnya": false
//     }
//   ]
// }
