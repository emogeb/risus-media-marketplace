import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { DashboardWidgetId } from '@admin/features/dashboard/widgets/registry'
import { DASHBOARD_WIDGETS } from '@admin/features/dashboard/widgets/registry'

const STORAGE_KEY = 'dashboard-preferences'

interface StoredPreferences {
  enabled: Record<DashboardWidgetId, boolean>
  order: DashboardWidgetId[]
}

function getDefaultPreferences(): StoredPreferences {
  const enabled: Record<DashboardWidgetId, boolean> = {}
  const order: DashboardWidgetId[] = []

  DASHBOARD_WIDGETS.forEach((widget) => {
    enabled[widget.id] = widget.defaultEnabled
    if (widget.defaultEnabled) {
      order.push(widget.id)
    }
  })

  return { enabled, order }
}

function loadPreferences(): StoredPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Validate structure
      if (parsed.enabled && parsed.order && Array.isArray(parsed.order)) {
        return parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load dashboard preferences:', error)
  }
  return getDefaultPreferences()
}

function savePreferences(prefs: StoredPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (error) {
    console.warn('Failed to save dashboard preferences:', error)
  }
}

export const useDashboardPreferencesStore = defineStore('dashboardPreferences', () => {
  const preferences = ref<StoredPreferences>(loadPreferences())

  // Watch for changes and save to localStorage
  watch(
    preferences,
    (newPrefs) => {
      savePreferences(newPrefs)
    },
    { deep: true }
  )

  function toggle(id: DashboardWidgetId): void {
    const isEnabled = preferences.value.enabled[id]
    preferences.value.enabled[id] = !isEnabled

    if (isEnabled) {
      // Remove from order
      const index = preferences.value.order.indexOf(id)
      if (index !== -1) {
        preferences.value.order.splice(index, 1)
      }
    } else {
      // Add to end of order
      preferences.value.order.push(id)
    }
  }

  function move(id: DashboardWidgetId, direction: 'up' | 'down'): void {
    const order = preferences.value.order
    const index = order.indexOf(id)

    if (index === -1) return

    if (direction === 'up' && index > 0) {
      // Swap with previous
      ;[order[index - 1], order[index]] = [order[index], order[index - 1]]
    } else if (direction === 'down' && index < order.length - 1) {
      // Swap with next
      ;[order[index], order[index + 1]] = [order[index + 1], order[index]]
    }
  }

  function resetDefaults(): void {
    preferences.value = getDefaultPreferences()
  }

  function setPreferences(newEnabled: Record<DashboardWidgetId, boolean>, newOrder: DashboardWidgetId[]): void {
    preferences.value.enabled = { ...newEnabled }
    preferences.value.order = [...newOrder]
  }

  const enabled = computed(() => preferences.value.enabled)
  const order = computed(() => preferences.value.order)

  return {
    enabled,
    order,
    toggle,
    move,
    resetDefaults,
    setPreferences,
  }
})
