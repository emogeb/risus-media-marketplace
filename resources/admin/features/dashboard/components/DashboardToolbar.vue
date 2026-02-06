<template>
  <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 border-b border-gray-200">
    <!-- Right: Date Range + Quick Actions -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
      <!-- Views Dropdown -->
      <DashboardViewsDropdown />

      <!-- Date Range Dropdown -->
      <div class="flex items-center gap-2">
        <label for="date-range" class="sr-only">Tarih aralığı</label>
        <select
          id="date-range"
          :value="filtersStore.selectedDateRange"
          class="h-9 px-3 py-0 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          @change="filtersStore.setDateRange(($event.target as HTMLSelectElement).value)"
        >
          <option value="today">{{ $t('dashboard.header.dateRange.today') }}</option>
          <option value="7d">{{ $t('dashboard.header.dateRange.last7Days') }}</option>
          <option value="30d">{{ $t('dashboard.header.dateRange.last30Days') }}</option>
          <option value="custom">{{ $t('dashboard.header.dateRange.custom') }}</option>
        </select>

        <!-- Custom Date Inputs -->
        <div v-if="filtersStore.selectedDateRange === 'custom'" class="flex items-center gap-2">
          <input
            :value="filtersStore.customDateFrom"
            type="date"
            class="h-9 px-3 py-0 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            @change="filtersStore.setCustomDates(($event.target as HTMLInputElement).value, filtersStore.customDateTo)"
          />
          <span class="text-sm text-gray-500">-</span>
          <input
            :value="filtersStore.customDateTo"
            type="date"
            class="h-9 px-3 py-0 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            @change="filtersStore.setCustomDates(filtersStore.customDateFrom, ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-2 flex-wrap">
        <UiButton
          size="sm"
          variant="secondary"
          @click="router.push('/orders')"
        >
          {{ $t('dashboard.toolbar.quickActions.orders') }}
        </UiButton>
        <UiButton
          size="sm"
          variant="secondary"
          @click="router.push('/products')"
        >
          {{ $t('dashboard.toolbar.quickActions.products') }}
        </UiButton>
        <UiButton
          size="sm"
          variant="secondary"
          @click="router.push('/sellers')"
        >
          {{ $t('dashboard.toolbar.quickActions.sellers') }}
        </UiButton>
        <UiButton
          size="sm"
          variant="ghost"
          @click="showCustomize = true"
        >
          {{ $t('dashboard.toolbar.customize') }}
        </UiButton>
      </div>
    </div>

    <!-- Customize Drawer -->
    <DashboardCustomizeDrawer :is-open="showCustomize" @update:is-open="showCustomize = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDashboardFiltersStore } from '@admin/stores/dashboardFilters'
import UiButton from '@admin/components/ui/UiButton.vue'
import DashboardCustomizeDrawer from './DashboardCustomizeDrawer.vue'
import DashboardViewsDropdown from './DashboardViewsDropdown.vue'

const router = useRouter()
const route = useRoute()
const filtersStore = useDashboardFiltersStore()

const showCustomize = ref(false)

// Load from URL on mount
onMounted(() => {
  if (route.query.range) {
    filtersStore.setDateRange(route.query.range as string)
    if (route.query.range === 'custom' && route.query.from && route.query.to) {
      filtersStore.setCustomDates(route.query.from as string, route.query.to as string)
    }
  }
})

// Sync store changes to URL
watch(
  () => [
    filtersStore.selectedDateRange,
    filtersStore.customDateFrom,
    filtersStore.customDateTo,
  ],
  ([range, from, to]) => {
    const query: Record<string, string> = { ...route.query }
    
    if (range && range !== 'today') {
      query.range = range
      if (range === 'custom' && from && to) {
        query.from = from
        query.to = to
      } else {
        delete query.from
        delete query.to
      }
    } else {
      delete query.range
      delete query.from
      delete query.to
    }
    
    router.replace({ query })
  }
)
</script>
