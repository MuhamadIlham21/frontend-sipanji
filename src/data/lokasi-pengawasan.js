// ============================================================
// DATA STATIS — Matriks Lokasi Pengawasan (Stepper 3)
// ============================================================
// Struktur: per kolom (unit) adalah radio button group mandiri.
// User bisa memilih 1 baris per kolom secara independen.
// ============================================================

export const KOLOM_LOKASI = [
  { id: 'kuh', label: 'Kantor Urusan Haji (KUH)' },
  { id: 'daker_bandara', label: 'Daker Bandara' },
  { id: 'daker_madinah', label: 'Daker Madinah' },
  { id: 'daker_mekkah', label: 'Daker Mekkah' },
]

export const BARIS_LOKASI = [
  { id: 'tidak_ada_sektor', label: 'Tidak Ada Sektor' },
  { id: 'sektor_1_bandara', label: 'Sektor 1 Bandara' },
  { id: 'sektor_2_bandara', label: 'Sektor 2 Bandara' },
  { id: 'sektor_1_madinah', label: 'Sektor 1 Madinah' },
  { id: 'sektor_2_madinah', label: 'Sektor 2 Madinah' },
  { id: 'sektor_3_madinah', label: 'Sektor 3 Madinah' },
  { id: 'sektor_4_madinah', label: 'Sektor 4 Madinah' },
  { id: 'sektor_5_madinah', label: 'Sektor 5 Madinah' },
  { id: 'sektor_masjid_nabawi', label: 'Sektor Masjid Nabawi' },
  { id: 'sektor_birr_ali', label: 'Sektor Birr Ali' },
  { id: 'sektor_1_mekkah', label: 'Sektor 1 Mekkah' },
  { id: 'sektor_2_mekkah', label: 'Sektor 2 Mekkah' },
  { id: 'sektor_3_mekkah', label: 'Sektor 3 Mekkah' },
  { id: 'sektor_4_mekkah', label: 'Sektor 4 Mekkah' },
  { id: 'sektor_5_mekkah', label: 'Sektor 5 Mekkah' },
  { id: 'sektor_6_mekkah', label: 'Sektor 6 Mekkah' },
  { id: 'sektor_7_mekkah', label: 'Sektor 7 Mekkah' },
  { id: 'sektor_8_mekkah', label: 'Sektor 8 Mekkah' },
  { id: 'sektor_9_mekkah', label: 'Sektor 9 Mekkah' },
  { id: 'sektor_10_mekkah', label: 'Sektor 10 Mekkah' },
  { id: 'sektor_masjidil_haram', label: 'Sektor Masjidil Haram' },
]

// Helper: default state untuk form (semua kolom null = belum dipilih)
export const defaultLokasiState = () =>
  Object.fromEntries(KOLOM_LOKASI.map((k) => [k.id, null]))
