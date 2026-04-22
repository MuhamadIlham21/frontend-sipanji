<template>
  <div class="flex justify-end">
    <nav aria-label="Breadcrumb">
      <ol class="flex items-center flex-wrap space-x-2 text-sm">
        <!-- Home Icon -->
        <li class="flex items-center">
          <!-- <router-link
            :to="{ name: 'dashboard.bpjph' }"
            class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            :style="{
              color:
                $route.name === 'dashboard.bpjph' || $route.name === 'dashboard.user'
                  ? 'var(--color-primary)'
                  : undefined,
            }"
          >
            <span class="material-icons text-lg">home</span>
          </router-link> -->
        </li>

        <!-- Breadcrumb Items -->
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <!-- Separator -->
          <li class="flex items-center">
            <!-- <span class="material-icons text-gray-400 text-lg">chevron_right</span> -->
            <span class="text-gray-400 mx-2">/</span>
          </li>

          <!-- Breadcrumb Link or Text -->
          <li class="flex items-center">
            <router-link
              v-if="crumb.link && index < breadcrumbs.length - 1"
              :to="crumb.link"
              class="text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              {{ crumb.label }}
            </router-link>
            <span v-else class="font-semibold" :style="{ color: 'var(--color-primary)' }">
              {{ crumb.label }}
            </span>
          </li>
        </template>
      </ol>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Generate breadcrumbs with dynamic params support
const breadcrumbs = computed(() => {
  if (route.meta.breadcrumb) {
    const crumbs = Array.isArray(route.meta.breadcrumb)
      ? route.meta.breadcrumb
      : [route.meta.breadcrumb]

    // Replace dynamic params in labels (e.g., :id with actual ID)
    return crumbs.map((crumb) => ({
      ...crumb,
      label: replaceDynamicParams(crumb.label),
    }))
  }

  return []
})

// Replace :param with actual value from route.params
const replaceDynamicParams = (label) => {
  if (!label.includes(':')) return label

  let replaced = label
  Object.keys(route.params).forEach((key) => {
    replaced = replaced.replace(`:${key}`, route.params[key])
  })

  return replaced
}
</script>
