import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'dashboard-filters'

interface DashboardFilters {
  selectedDateRange: string
  customDateFrom: string
  customDateTo: string
}

function getDefaultFilters(): DashboardFilters {
  return {
    selectedDateRange: 'today',
    customDateFrom: '',
    customDateTo: '',
  }
}

function loadFilters(): DashboardFilters {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.selectedDateRange) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load dashboard filters:', error)
  }
  return getDefaultFilters()
}

function saveFilters(filters: DashboardFilters): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  } catch (error) {
    console.warn('Failed to save dashboard filters:', error)
  }
}

export const useDashboardFiltersStore = defineStore('dashboardFilters', () => {
  const filters = ref<DashboardFilters>(loadFilters())

  // Watch for changes and save to localStorage
  watch(
    filters,
    (newFilters) => {
      saveFilters(newFilters)
    },
    { deep: true }
  )

  function setDateRange(range: string): void {
    filters.value.selectedDateRange = range
  }

  function setCustomDates(from: string, to: string): void {
    filters.value.customDateFrom = from
    filters.value.customDateTo = to
  }

  function resetFilters(): void {
    filters.value = getDefaultFilters()
  }

  return {
    selectedDateRange: computed(() => filters.value.selectedDateRange),
    customDateFrom: computed(() => filters.value.customDateFrom),
    customDateTo: computed(() => filters.value.customDateTo),
    setDateRange,
    setCustomDates,
    resetFilters,
  }
})
