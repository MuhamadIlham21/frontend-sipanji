// ============================================================
// DATA INTERNAL FE — Provinsi & Embarkasi (Stepper 4 & 5)
// ============================================================
// CATATAN: Data ini adalah fallback internal FE.
// Ganti dengan versi API (lihat komentar di bawah) saat
// endpoint sudah tersedia dari Backend.
// ============================================================

export const PROVINSI_EMBARKASI = [
  { id: 'aceh', label: 'Aceh' },
  { id: 'sumut', label: 'Sumatera Utara' },
  { id: 'sumbar', label: 'Sumatera Barat' },
  { id: 'riau', label: 'Riau' },
  { id: 'sumsel', label: 'Sumatera Selatan' },
  { id: 'lampung', label: 'Lampung' },
  { id: 'dki', label: 'DKI Jakarta' },
  { id: 'jabar', label: 'Jawa Barat' },
  { id: 'jateng', label: 'Jawa Tengah' },
  { id: 'diy', label: 'DI Yogyakarta' },
  { id: 'jatim', label: 'Jawa Timur' },
  { id: 'kalsel', label: 'Kalimantan Selatan' },
  { id: 'sulsel', label: 'Sulawesi Selatan' },
]

// Embarkasi per provinsi
export const EMBARKASI_BY_PROVINSI = {
  aceh: [
    { id: 'btj', label: 'Embarkasi Banda Aceh (BTJ)' },
  ],
  sumut: [
    { id: 'mez', label: 'Embarkasi Medan (MEZ)' },
  ],
  sumbar: [
    { id: 'pdg', label: 'Embarkasi Padang (PDG)' },
  ],
  riau: [
    { id: 'pkn', label: 'Embarkasi Pekanbaru (PKN)' },
  ],
  sumsel: [
    { id: 'plm', label: 'Embarkasi Palembang (PLM)' },
  ],
  lampung: [
    { id: 'jkt', label: 'Embarkasi Jakarta (Pondok Gede)' },
  ],
  dki: [
    { id: 'jkt', label: 'Embarkasi Jakarta (Pondok Gede)' },
    { id: 'jkt2', label: 'Embarkasi Jakarta (Bekasi)' },
  ],
  jabar: [
    { id: 'jkt', label: 'Embarkasi Jakarta (Pondok Gede)' },
    { id: 'jkt2', label: 'Embarkasi Jakarta (Bekasi)' },
  ],
  jateng: [
    { id: 'sol', label: 'Embarkasi Solo (SOL)' },
  ],
  diy: [
    { id: 'sol', label: 'Embarkasi Solo (SOL)' },
  ],
  jatim: [
    { id: 'sub', label: 'Embarkasi Surabaya (SUB)' },
  ],
  kalsel: [
    { id: 'bpn', label: 'Embarkasi Banjarmasin (BPN)' },
  ],
  sulsel: [
    { id: 'upg', label: 'Embarkasi Makassar (UPG)' },
  ],
}

// ============================================================
// 🟢 VERSI API — Uncomment saat endpoint tersedia
// ============================================================
// import apiClient from './axios'
//
// export const monitoringApi = {
//   getProvinsiEmbarkasi() {
//     return apiClient.get('/embarkasi/provinsi')
//   },
//   getEmbarkasiByProvinsi(provinsiId) {
//     return apiClient.get(`/embarkasi?provinsiId=${provinsiId}`)
//   },
// }
