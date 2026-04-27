<template>
  <UserLayoutApp>
    <template #main-admin>
      <!-- Error Alert -->
      <Transition name="fade">
        <div
          v-if="store.error && !store.isLoading"
          class="mb-6 bg-surface border-l-4 rounded-lg p-4 flex items-center gap-3"
          :style="{ borderLeftColor: 'var(--color-error)' }"
        >
          <span class="material-icons text-error">error_outline</span>
          <p class="text-sm text-text flex-1">{{ store.error }}</p>
          <button
            @click="store.fetchDashboard()"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
            :style="{ backgroundColor: 'var(--color-primary)' }"
          >
            <span class="material-icons text-base">refresh</span>
            Coba Lagi
          </button>
        </div>
      </Transition>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="card in kpiCards"
          :key="card.key"
          class="bg-surface rounded-xl p-5 shadow-sm border border-surface-2 flex items-center justify-between gap-4"
        >
          <div>
            <p class="text-xs text-text-muted mb-1">{{ card.label }}</p>
            <!-- Skeleton -->
            <div
              v-if="store.isLoading"
              class="h-8 w-16 rounded-md bg-surface-offset animate-pulse"
            ></div>
            <p v-else class="text-3xl font-bold text-text tabular-nums">
              {{ store.kpi[card.key] ?? 0 }}
            </p>
          </div>
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            :style="{ backgroundColor: card.bgColor }"
          >
            <span class="material-icons text-2xl" :style="{ color: card.iconColor }">
              {{ card.icon }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tren Submission -->
      <div class="bg-surface rounded-xl shadow-sm border border-surface-2 p-5 mb-6">
        <div class="mb-4">
          <h2 class="font-semibold text-text">Tren Submission</h2>
          <p class="text-xs text-text-muted mt-0.5">7 hari terakhir</p>
        </div>

        <!-- Skeleton -->
        <div v-if="store.isLoading" class="animate-pulse h-64 rounded-lg bg-surface-offset"></div>

        <!-- Chart -->
        <apexchart
          v-else-if="store.grafikTren.length > 0"
          type="area"
          height="260"
          :series="store.trenSeries"
          :options="trenOptions"
        />

        <!-- Empty -->
        <div v-else class="flex flex-col items-center justify-center py-16 text-text-faint">
          <span class="material-icons text-5xl mb-2">show_chart</span>
          <p class="text-sm">Belum ada data tren</p>
        </div>
      </div>

      <!-- Distribusi Charts -->
      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="bg-surface rounded-xl shadow-sm border border-surface-2 p-5">
          <div class="mb-4">
            <h2 class="font-semibold text-text">Distribusi Provinsi</h2>
            <p class="text-xs text-text-muted mt-0.5">Berdasarkan submission masuk</p>
          </div>

          <div v-if="store.isLoading" class="animate-pulse h-64 rounded-lg bg-surface-offset"></div>

          <apexchart
            v-else-if="store.provinsiChartData.length > 0"
            type="bar"
            :height="Math.max(200, store.provinsiChartData.length * 36)"
            :series="provinsiSeries"
            :options="provinsiOptions"
          />

          <div v-else class="flex flex-col items-center justify-center py-16 text-text-faint">
            <span class="material-icons text-5xl mb-2">bar_chart</span>
            <p class="text-sm">Belum ada data distribusi provinsi</p>
          </div>
        </div>

        <div class="bg-surface rounded-xl shadow-sm border border-surface-2 p-5">
          <div class="mb-4">
            <h2 class="font-semibold text-text">Distribusi Embarkasi</h2>
            <p class="text-xs text-text-muted mt-0.5">Berdasarkan submission masuk</p>
          </div>

          <div v-if="store.isLoading" class="animate-pulse h-64 rounded-lg bg-surface-offset"></div>

          <apexchart
            v-else-if="store.embarkasiChartData.length > 0"
            type="donut"
            height="300"
            :series="embarkasiSeries"
            :options="embarkasiOptions"
          />

          <div v-else class="flex flex-col items-center justify-center py-16 text-text-faint">
            <span class="material-icons text-5xl mb-2">donut_large</span>
            <p class="text-sm">Belum ada data distribusi embarkasi</p>
          </div>
        </div>
      </div> -->

      <!-- Data Terbaru -->
      <!-- <div class="bg-surface rounded-xl shadow-sm border border-surface-2 p-5 mb-6">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-text">Submission Terbaru</h2>
            <p class="text-xs text-text-muted mt-0.5">5 submission terakhir</p>
          </div>
          <router-link
            :to="{ name: 'laporan.monitoring' }"
            class="flex items-center gap-1 text-xs font-medium transition-colors"
            :style="{ color: 'var(--color-primary)' }"
          >
            Lihat Semua
            <span class="material-icons text-base">chevron_right</span>
          </router-link>
        </div>

        <div v-if="store.isLoading" class="space-y-3">
          <div
            v-for="i in 5"
            :key="i"
            class="animate-pulse h-14 rounded-lg bg-surface-offset"
          ></div>
        </div>

        <div v-else-if="store.dataTerbaru.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-surface-2">
                <th
                  class="pb-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide"
                >
                  Nama
                </th>
                <th
                  class="pb-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide"
                >
                  NIK / NIP
                </th>
                <th
                  class="pb-3 text-left text-xs font-medium text-text-muted uppercase tracking-wide hidden md:table-cell"
                >
                  Email
                </th>
                <th
                  class="pb-3 text-right text-xs font-medium text-text-muted uppercase tracking-wide"
                >
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-2">
              <tr
                v-for="item in store.dataTerbaru"
                :key="item.nik"
                class="hover:bg-background transition-colors"
              >
                <td class="py-3 pr-4">
                  <div class="flex items-center gap-2.5">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                      :style="{ backgroundColor: 'var(--color-primary)' }"
                    >
                      {{ getInitial(item.nama) }}
                    </div>
                    <span class="font-medium text-text">{{ decodeHtml(item.nama) }}</span>
                  </div>
                </td>

                <td class="py-3 pr-4 text-text-muted tabular-nums">
                  {{ item.nik || '-' }}
                </td>

                <td class="py-3 pr-4 text-text-muted hidden md:table-cell">
                  {{ decodeHtml(item.email) || '-' }}
                </td>

                <td class="py-3 text-right text-text-muted text-xs whitespace-nowrap">
                  {{ formatDate(item.date) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16 text-text-faint">
          <span class="material-icons text-5xl mb-2">inbox</span>
          <p class="text-sm">Belum ada submission</p>
        </div>
      </div> -->
    </template>
  </UserLayoutApp>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import UserLayoutApp from '@/Layouts/UserLayoutApp.vue'
import { useDashboardStore } from '@/stores/dashboard'

const store = useDashboardStore()

// ============================================================
// KPI CARDS CONFIG
// ============================================================
const kpiCards = [
  {
    key: 'total_submission',
    label: 'Total Submission',
    icon: 'assignment',
    bgColor: '#f3ead8',
    iconColor: 'var(--color-primary)',
  },
  {
    key: 'today_submission',
    label: 'Hari Ini',
    icon: 'today',
    bgColor: '#dcedc8',
    iconColor: 'var(--color-success)',
  },
  {
    key: 'weekly_submission',
    label: 'Minggu Ini',
    icon: 'date_range',
    bgColor: '#e3f2fd',
    iconColor: 'var(--color-info)',
  },
  {
    key: 'monthly_submission',
    label: 'Bulan Ini',
    icon: 'calendar_month',
    bgColor: '#fce4ec',
    iconColor: 'var(--color-error)',
  },
]

// ============================================================
// CHART OPTIONS — Tren
// ============================================================
const trenOptions = computed(() => ({
  chart: {
    type: 'area',
    toolbar: { show: false },
    sparkline: { enabled: false },
    fontFamily: 'inherit',
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.02,
      stops: [0, 100],
    },
  },
  colors: ['var(--color-primary)'],
  xaxis: {
    categories: store.trenCategories,
    labels: {
      style: { fontSize: '11px', colors: 'var(--color-text-muted)' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: 'var(--color-text-muted)' },
      formatter: (val) => Math.round(val),
    },
    min: 0,
  },
  grid: {
    borderColor: 'var(--color-divider)',
    strokeDashArray: 4,
    padding: { left: 8, right: 8 },
  },
  markers: {
    size: 4,
    colors: ['var(--color-primary)'],
    strokeColors: '#fff',
    strokeWidth: 2,
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} submission` },
  },
}))

// ============================================================
// CHART OPTIONS — Distribusi Provinsi (Bar Horizontal)
// ============================================================
const provinsiSeries = computed(() => [
  {
    name: 'Submission',
    data: store.provinsiChartData.map((item) => item.total),
  },
])

const provinsiOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    fontFamily: 'inherit',
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      barHeight: '70%',
      dataLabels: { position: 'right' },
    },
  },
  colors: ['var(--color-primary)'],
  dataLabels: {
    enabled: true,
    offsetX: 4,
    style: {
      fontSize: '11px',
      colors: ['var(--color-text-muted)'],
      fontWeight: '600',
    },
  },
  xaxis: {
    categories: store.provinsiChartData.map((item) => item.label),
    labels: {
      style: { fontSize: '11px', colors: 'var(--color-text-muted)' },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: 'var(--color-text-muted)' },
      maxWidth: 140,
    },
  },
  grid: {
    borderColor: 'var(--color-divider)',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} submission` },
  },
}))

// ============================================================
// CHART OPTIONS — Distribusi Embarkasi (Donut)
// ============================================================
const embarkasiSeries = computed(() => store.embarkasiChartData.map((item) => item.total))

const embarkasiOptions = computed(() => ({
  chart: {
    type: 'donut',
    fontFamily: 'inherit',
  },
  labels: store.embarkasiChartData.map((item) => item.label),
  colors: [
    'var(--color-primary)',
    '#c9a856',
    '#d4af37',
    '#8c6f33',
    '#72582a',
    '#594322',
    '#e3cd99',
    '#d5b66f',
  ],
  legend: {
    position: 'bottom',
    fontSize: '11px',
    labels: { colors: 'var(--color-text-muted)' },
    itemMargin: { horizontal: 8, vertical: 4 },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '11px',
      fontWeight: '600',
    },
    formatter: (val) => `${Math.round(val)}%`,
    dropShadow: { enabled: false },
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
        },
      },
    },
  },
  stroke: { width: 2, colors: ['var(--color-surface)'] },
  tooltip: {
    theme: 'light',
    y: { formatter: (val) => `${val} submission` },
  },
}))

// ============================================================
// HELPERS
// ============================================================
function getInitial(nama) {
  if (!nama) return '?'
  return decodeHtml(nama).charAt(0).toUpperCase()
}

function decodeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  store.fetchDashboard()
})
</script>
