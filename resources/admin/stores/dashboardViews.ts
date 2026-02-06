import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { DashboardView } from '@admin/features/dashboard/views/types'
import { useDashboardPreferencesStore } from './dashboardPreferences'
import { useDashboardFiltersStore } from './dashboardFilters'
import type { DashboardWidgetId } from '@admin/features/dashboard/widgets/registry'

const STORAGE_KEY = 'dashboard-views'

function generateId(): string {
  return `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function getPresetViews(): DashboardView[] {
  return [
    {
      id: 'preset_operations',
      name: 'Operasyon',
      createdAt: new Date().toISOString(),
      preferencesSnapshot: {
        enabled: {
          kpis: true,
          production: true,
          alerts: true,
          revenue: false,
          operations: true,
          recentOrders: true,
          lowStock: false,
        },
        order: ['kpis', 'production', 'alerts', 'operations', 'recentOrders'],
      },
      dateRangeSnapshot: {
        selectedDateRange: 'today',
      },
    },
    {
      id: 'preset_finance',
      name: 'Finans',
      createdAt: new Date().toISOString(),
      preferencesSnapshot: {
        enabled: {
          kpis: true,
          production: false,
          alerts: false,
          revenue: true,
          operations: false,
          recentOrders: false,
          lowStock: false,
        },
        order: ['kpis', 'revenue'],
      },
      dateRangeSnapshot: {
        selectedDateRange: '30d',
      },
    },
    {
      id: 'preset_executive',
      name: 'Yönetici',
      createdAt: new Date().toISOString(),
      preferencesSnapshot: {
        enabled: {
          kpis: true,
          production: true,
          alerts: true,
          revenue: true,
          operations: true,
          recentOrders: true,
          lowStock: true,
        },
        order: ['kpis', 'production', 'alerts', 'revenue', 'operations', 'recentOrders', 'lowStock'],
      },
      dateRangeSnapshot: {
        selectedDateRange: '7d',
      },
    },
  ]
}

function loadViews(): DashboardView[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load dashboard views:', error)
  }
  return getPresetViews()
}

function saveViews(views: DashboardView[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
  } catch (error) {
    console.warn('Failed to save dashboard views:', error)
  }
}

export const useDashboardViewsStore = defineStore('dashboardViews', () => {
  const views = ref<DashboardView[]>(loadViews())
  const activeViewId = ref<string | null>(null)

  // Watch for changes and save to localStorage
  watch(
    views,
    (newViews) => {
      saveViews(newViews)
    },
    { deep: true }
  )

  function saveCurrentAs(name: string): void {
    const preferencesStore = useDashboardPreferencesStore()
    const filtersStore = useDashboardFiltersStore()

    const newView: DashboardView = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      preferencesSnapshot: {
        enabled: { ...preferencesStore.enabled },
        order: [...preferencesStore.order],
      },
      dateRangeSnapshot: {
        selectedDateRange: filtersStore.selectedDateRange,
        customDateFrom: filtersStore.customDateFrom || undefined,
        customDateTo: filtersStore.customDateTo || undefined,
      },
    }

    views.value.push(newView)
    activeViewId.value = newView.id
  }

  function applyView(id: string): void {
    const view = views.value.find((v) => v.id === id)
    if (!view) return

    const preferencesStore = useDashboardPreferencesStore()
    const filtersStore = useDashboardFiltersStore()

    // Apply preferences
    preferencesStore.setPreferences(
      view.preferencesSnapshot.enabled,
      view.preferencesSnapshot.order
    )

    // Apply filters
    filtersStore.setDateRange(view.dateRangeSnapshot.selectedDateRange)
    if (view.dateRangeSnapshot.customDateFrom && view.dateRangeSnapshot.customDateTo) {
      filtersStore.setCustomDates(
        view.dateRangeSnapshot.customDateFrom,
        view.dateRangeSnapshot.customDateTo
      )
    }

    activeViewId.value = id
  }

  function renameView(id: string, newName: string): void {
    const view = views.value.find((v) => v.id === id)
    if (view) {
      view.name = newName
    }
  }

  function deleteView(id: string): void {
    // Don't delete preset views
    if (id.startsWith('preset_')) return

    const index = views.value.findIndex((v) => v.id === id)
    if (index !== -1) {
      views.value.splice(index, 1)
      if (activeViewId.value === id) {
        activeViewId.value = null
      }
    }
  }

  function setActive(id: string | null): void {
    activeViewId.value = id
  }

  const allViews = computed(() => views.value)
  const customViews = computed(() => views.value.filter((v) => !v.id.startsWith('preset_')))
  const presetViews = computed(() => views.value.filter((v) => v.id.startsWith('preset_')))

  return {
    allViews,
    customViews,
    presetViews,
    activeViewId: computed(() => activeViewId.value),
    saveCurrentAs,
    applyView,
    renameView,
    deleteView,
    setActive,
  }
})
