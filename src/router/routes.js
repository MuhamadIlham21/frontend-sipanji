const routes = [
  {
    path: '/',
    component: () => import('@/views/MonitoringView.vue'),
    name: 'monitoring',
    meta: {
      layout: 'blank',
      title: 'Monitoring',
      description: 'Monitoring Pengendalian Operasional Haji',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/LoginApp.vue'),
    name: 'login',
    meta: {
      layout: 'blank',
      title: 'Login',
      description: 'Masukkan username dan password anda!',
      requiresAuth: false,
    },
  },
  {
    path: '/admin/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard/DashboardAdmin.vue'),
    meta: {
      title: 'Dashboard',
      subtitle: 'Informasi cepat',
      breadcrumb: [{ label: 'Dashboard', link: null }],
      requiresAuth: true,
    },
  },

  {
    path: '/admin/laporan-monitoring',
    name: 'laporan.monitoring',
    component: () => import('@/views/Laporan/LaporanMonitoring.vue'),
    meta: {
      title: 'Laporan Monitoring',
      subtitle: 'Hasil submit monitoring operasional haji',
      breadcrumb: [{ label: 'Laporan Monitoring', link: null }],
      requiresAuth: true,
    },
  },

  {
    path: '/admin/laporan-monitoring/:id',
    name: 'laporan.monitoring.detail',
    component: () => import('@/views/Laporan/DetailMonitoring.vue'),
    meta: {
      title: 'Detail Monitoring',
      subtitle: 'Detail hasil submit monitoring',
      breadcrumb: [
        { label: 'Laporan Monitoring', link: 'laporan.monitoring' },
        { label: 'Detail', link: null },
      ],
      requiresAuth: true,
    },
  },
]

export default routes
