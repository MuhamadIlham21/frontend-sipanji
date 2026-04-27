<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <!-- Loading State -->
    <div v-if="isLoading" class="animate-pulse p-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="bg-gray-200 rounded h-10 w-32"></div>
        <div class="bg-gray-200 rounded h-10 w-64"></div>
      </div>
      <div class="space-y-3">
        <div class="bg-gray-200 rounded h-12"></div>
        <div v-for="i in 5" :key="i" class="bg-gray-200 rounded h-16"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <span class="material-icons text-red-500">error</span>
        <div>
          <p class="text-red-800 font-medium">Error loading data</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
        <button
          @click="reloadData"
          class="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else>
      <!-- Header Controls -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Left: Rows per page & Export -->
          <div class="flex items-center gap-4">
            <!-- Rows per page -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-700">Show:</label>
              <select
                v-model="filters.limit"
                @change="onLimitChange"
                class="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:border-transparent transition-all"
                :style="{ '--tw-ring-color': 'var(--color-primary)' }"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>

            <!-- Export Button (if slot provided) -->
            <slot name="export-button">
              <button
                v-if="showExport"
                @click="$emit('export')"
                class="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm"
              >
                <span class="material-icons text-lg">download</span>
                Export
              </button>
            </slot>
          </div>

          <!-- Right: Search -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <input
                v-model="filters.search"
                @input="onSearchDebounce"
                type="text"
                placeholder="Search..."
                class="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:ring-2 focus:border-transparent transition-all"
                :style="{ '--tw-ring-color': 'var(--color-primary)' }"
              />
              <span class="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
            </div>
          </div>
        </div>

        <!-- Additional Filters Slot -->
        <div v-if="$slots.filters" class="mt-4">
          <slot name="filters"></slot>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr :style="{ backgroundColor: 'var(--color-primary)' }">
              <th
                class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
              >
                No
              </th>
              <th
                v-for="column in columns"
                :key="column.key"
                @click="column.sortable && toggleSort(column.key)"
                class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                :class="{ 'cursor-pointer hover:bg-black/10': column.sortable }"
              >
                <div class="flex items-center gap-2">
                  {{ column.label }}
                  <span v-if="column.sortable" class="material-icons text-sm">
                    {{
                      sortBy === column.key
                        ? sortOrder === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'
                    }}
                  </span>
                </div>
              </th>
              <th
                v-if="$slots.actions"
                class="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Empty State -->
            <tr v-if="tableData.length === 0">
              <td :colspan="columns.length + 2" class="px-6 py-12 text-center">
                <span class="material-icons text-5xl text-gray-300 mb-2 block">search_off</span>
                <p class="text-gray-500 font-medium">No data found</p>
                <p class="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
              v-for="(row, index) in tableData"
              :key="row.id || index"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                {{ (currentPage - 1) * filters.limit + index + 1 }}
              </td>
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 text-sm"
                :class="column.align || 'text-left'"
              >
                <slot
                  v-if="$slots[`cell-${column.key}`]"
                  :name="`cell-${column.key}`"
                  :value="row[column.key]"
                  :row="row"
                />
                <!-- Fallback: formatter / style / plain -->
                <template v-else>
                  <div
                    v-if="column.formatter || column.style"
                    :class="[
                      typeof column.style === 'function' ? column.style(row[column.key], row) : '',
                    ]"
                    class="inline-block rounded px-2 py-1"
                  >
                    <span v-if="column.formatter">
                      {{ column.formatter(row[column.key], row) }}
                    </span>
                    <span v-else>
                      {{ row[column.key] }}
                    </span>
                  </div>
                  <span v-else class="text-gray-900">
                    {{ row[column.key] }}
                  </span>
                </template>
              </td>
              <td v-if="$slots.actions" class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <slot name="actions" :row="row" :index="index" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-4 py-3 border-t border-gray-200">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <!-- Info -->
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * filters.limit + 1 }} to
            {{ Math.min(currentPage * filters.limit, totalItems) }} of {{ totalItems }} entries
          </div>

          <!-- Pagination Buttons -->
          <div class="flex gap-1">
            <button
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
              class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <span class="material-icons text-sm">chevron_left</span>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              class="px-3 py-2 border rounded-lg transition-all text-sm font-medium"
              :class="
                currentPage === page
                  ? 'text-white border-transparent'
                  : 'border-gray-300 hover:bg-gray-50'
              "
              :style="currentPage === page ? { backgroundColor: 'var(--color-primary)' } : {}"
            >
              {{ page }}
            </button>

            <button
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
              class="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              <span class="material-icons text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  showExport: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['fetch-data', 'export'])

const filters = ref({
  search: '',
  limit: 10,
})

const currentPage = ref(1)
const sortBy = ref(null)
const sortOrder = ref('asc')

const isLoading = computed(() => props.loading)
const tableData = computed(() => props.data)
const totalPages = computed(() => Math.ceil(props.totalItems / filters.value.limit))

// Visible pagination buttons
const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const range = 2
  const pages = new Set()

  pages.add(1)
  if (total > 1) pages.add(total)

  for (let i = Math.max(2, current - range); i <= Math.min(total - 1, current + range); i++) {
    pages.add(i)
  }

  return Array.from(pages).sort((a, b) => a - b)
})

let searchTimeout = null
const onSearchDebounce = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 500)
}

const onLimitChange = () => {
  currentPage.value = 1
  fetchData()
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const toggleSort = (key) => {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = key
    sortOrder.value = 'asc'
  }
  fetchData()
}

const fetchData = () => {
  emit('fetch-data', {
    page: currentPage.value,
    limit: filters.value.limit,
    search: filters.value.search,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
  })
}

const reloadData = () => {
  fetchData()
}

// Initial fetch
onMounted(() => {
  fetchData()
})
</script>
