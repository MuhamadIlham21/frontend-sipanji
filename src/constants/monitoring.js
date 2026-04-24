// ============================================================
// KONSTANTA — Monitoring Operasional Haji (SiPanji)
// ============================================================

// ----------------------------------------------------------
// FORM ID
// ----------------------------------------------------------
export const MONITORING_FORM_ID = '0af7b253-e3dd-44c5-a7f5-792e59c35406'

// ----------------------------------------------------------
// MONITORING_STEPS — 7 Step
// ----------------------------------------------------------
export const MONITORING_STEPS = [
  { id: 1, title: 'Jenis Paket', subtitle: 'Reguler / Haji Khusus', icon: 'luggage' },
  { id: 2, title: 'Kontributor', subtitle: 'Identitas pengisi', icon: 'person' },
  { id: 3, title: 'Lokasi', subtitle: 'Sektor & lokasi', icon: 'location_on' },
  { id: 4, title: 'Provinsi', subtitle: 'Asal daerah', icon: 'map' },
  { id: 5, title: 'Embarkasi', subtitle: 'Kota embarkasi', icon: 'flight_takeoff' },
  { id: 6, title: 'Tindakan', subtitle: 'Jenis tindakan', icon: 'assignment_turned_in' },
  { id: 7, title: 'Monev', subtitle: 'Pengawasan & evaluasi', icon: 'assignment' },
]

// ----------------------------------------------------------
// TIPE_PERTANYAAN — Step 7 Accordion
// ----------------------------------------------------------
export const TIPE_PERTANYAAN = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  TEXTAREA: 'textarea',
  TEXT: 'text',
  FILE: 'file',
  NUMBER: 'number',
}

// ----------------------------------------------------------
// TAB & ACCORDION — Hardcoded sementara (belum dari API)
// Akan digantikan API berdasarkan tindakan_value di Step 6
// ----------------------------------------------------------
export const TAB_PENGAWASAN = [
  {
    id: '570a0bfa-b619-42bf-b0e0-494240706413',
    label: 'Transportasi Udara',
    shortLabel: 'Trans. Udara',
    icon: 'flight',
  },
  {
    id: '1e7f32ec-947e-4807-bdb1-e896cf392333',
    label: 'Transportasi Darat',
    shortLabel: 'Trans. Darat',
    icon: 'directions_bus',
  },
  {
    id: '69f9c245-9c96-4f2f-979f-c5a93c86fb81',
    label: 'Konsumsi',
    shortLabel: 'Konsumsi',
    icon: 'restaurant',
  },
  {
    id: '71827edf-ed1a-4126-940c-a2470002c774',
    label: 'Akomodasi',
    shortLabel: 'Akomodasi',
    icon: 'hotel',
  },
  {
    id: '5be6ee83-15b0-4954-8c5f-f5ea353e7d1d',
    label: 'Masyair',
    shortLabel: 'Masyair',
    icon: 'mosque',
  },
  {
    id: '9b60a6a5-86a5-40e6-b56c-9fc04afbdb83',
    label: 'Perlindungan Jemaah',
    shortLabel: 'Perlindungan',
    icon: 'security',
  },
  {
    id: 'adc98c4a-3cef-48e5-8c03-f1ea8891dc3f',
    label: 'Pemotongan DAM',
    shortLabel: 'DAM',
    icon: 'content_cut',
  },
]

export const ACCORDION_PENGAWASAN = {
  '570a0bfa-b619-42bf-b0e0-494240706413': [
    {
      id: 'd51f88c4-4359-43b9-a3ab-6f78cd4d6100',
      label: 'Pengawasan Kedatangan Jemaah Haji di Bandara Jeddah/Madinah',
    },
    {
      id: '7a1a82bb-9509-4c71-85ae-27f2a6f5429a',
      label: 'Pengawasan Kepulangan Jemaah Haji di Bandara Jeddah/Madinah',
    },
  ],
  '1e7f32ec-947e-4807-bdb1-e896cf392333': [
    {
      id: '943120d0-47db-491c-aedc-6116b0b9ccd8',
      label: 'Transportasi AKAP (Antar Kota Antar Provinsi)',
    },
    { id: '0d74000a-30cc-460d-bc81-c26ee34e65ed', label: 'Transportasi Sholawat' },
  ],
  '69f9c245-9c96-4f2f-979f-c5a93c86fb81': [
    {
      id: 'b2d23d31-d4dc-4127-8255-d20732772a10',
      label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Bandara Jeddah',
    },
    {
      id: 'f3c5b8c4-40b5-406d-8611-82e3e6940d41',
      label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Jeddah',
    },
    {
      id: 'c408fd7e-f6ea-41fb-bf86-773da52db2d6',
      label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Madinah',
    },
    {
      id: 'bcfa6a20-58de-46d0-b26d-829e3e0cb24f',
      label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Madinah',
    },
    {
      id: '7e0739aa-417f-4b5c-922c-e51ca7d04abc',
      label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Makkah',
    },
    {
      id: 'a72bf5cf-398a-4856-bd96-755135315e56',
      label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Makkah',
    },
    {
      id: '8b94859e-6d3c-4149-a629-34f4ccd8a371',
      label: 'Pengawasan Dapur Layanan Konsumsi di Wilayah Armuzna',
    },
    {
      id: '8fd7a3d4-db3c-4947-9f04-c8b51e3afd22',
      label: 'Pengawasan Distribusi Layanan Konsumsi di Wilayah Armuzna',
    },
  ],
  '71827edf-ed1a-4126-940c-a2470002c774': [
    {
      id: '475f341f-d13d-4179-8de8-22fd9622a008',
      label: 'Pengawasan Kedatangan Jemaah Haji Reguler di Hotel Makkah/Madinah',
    },
    {
      id: '02d9cce7-cdd9-4da3-8c29-0e9284da8056',
      label: 'Pengawasan Kegiatan Jemaah selama di Hotel Makkah dan Madinah',
    },
    {
      id: '42b37390-8cd0-4310-a481-4178ed62b556',
      label: 'Pengawasan Kepulangan/Keberangkatan Jemaah Haji Reguler di Hotel Makkah/Madinah',
    },
  ],
  '5be6ee83-15b0-4954-8c5f-f5ea353e7d1d': [
    {
      id: '09197e2a-c476-4892-975d-ed06524d19d8',
      label: 'Pengawasan Kegiatan Pelayanan Jemaah Haji Reguler di Arafah',
    },
    {
      id: 'a62cf7a6-904b-4fc9-a258-f8ac68aac423',
      label: 'Pengawasan Kegiatan Pelayanan Jemaah Haji Reguler di Muzdalifah',
    },
    {
      id: 'ad4221b7-4c9e-46f6-8761-8f694419e4d1',
      label: 'Pengawasan Kegiatan Pelayanan Jemaah Haji Reguler di Mina',
    },
    {
      id: '37780e51-f872-404f-be9a-734f5591ebb9',
      label: 'Pengawasan Kegiatan Jemaah Haji Reguler di Jamarat',
    },
    {
      id: '9c3c0786-9501-4fe5-9651-eaa3410c2f41',
      label: 'Pengawasan Kegiatan Jemaah Menuju dan Kembali dari Jamarat',
    },
  ],
  '9b60a6a5-86a5-40e6-b56c-9fc04afbdb83': [
    {
      id: '9b60a001-0000-0000-0000-000000000001',
      label: 'Pengawasan Operasional Perlindungan Jemaah',
    },
  ],
  'adc98c4a-3cef-48e5-8c03-f1ea8891dc3f': [
    { id: 'adc98001-0000-0000-0000-000000000002', label: 'Pengawasan Pemotongan DAM' },
  ],
}
