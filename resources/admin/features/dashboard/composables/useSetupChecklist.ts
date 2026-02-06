import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'setup-checklist-completed'

export type SetupStepId =
  | 'company-info'
  | 'first-product'
  | 'first-seller'
  | 'fulfillment-settings'
  | 'payment-settings'
  | 'customize-dashboard'

interface SetupStep {
  id: SetupStepId
  route?: string
  action?: () => void
}

const allSteps: SetupStep[] = [
  { id: 'company-info', route: '/settings' },
  { id: 'first-product', route: '/products' },
  { id: 'first-seller', route: '/sellers' },
  { id: 'fulfillment-settings', route: '/fulfillment' },
  { id: 'payment-settings', route: '/settings' },
  { id: 'customize-dashboard' }, // Special: opens customize drawer
]

function loadCompletedSteps(): Set<SetupStepId> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return new Set(parsed)
      }
    }
  } catch (error) {
    console.warn('Failed to load setup checklist:', error)
  }
  return new Set()
}

function saveCompletedSteps(steps: Set<SetupStepId>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(steps)))
  } catch (error) {
    console.warn('Failed to save setup checklist:', error)
  }
}

export function useSetupChecklist() {
  const completedSteps = ref<Set<SetupStepId>>(loadCompletedSteps())

  // Watch for changes and save to localStorage
  watch(
    () => Array.from(completedSteps.value),
    () => {
      saveCompletedSteps(completedSteps.value)
    }
  )

  function markCompleted(stepId: SetupStepId): void {
    completedSteps.value.add(stepId)
  }

  function markIncomplete(stepId: SetupStepId): void {
    completedSteps.value.delete(stepId)
  }

  function toggleStep(stepId: SetupStepId): void {
    if (completedSteps.value.has(stepId)) {
      markIncomplete(stepId)
    } else {
      markCompleted(stepId)
    }
  }

  function resetAll(): void {
    completedSteps.value.clear()
  }

  const progress = computed(() => {
    const total = allSteps.length
    const completed = completedSteps.value.size
    return Math.round((completed / total) * 100)
  })

  const isAllCompleted = computed(() => {
    return completedSteps.value.size === allSteps.length
  })

  const steps = computed(() => allSteps)

  return {
    steps,
    completedSteps: computed(() => completedSteps.value),
    progress,
    isAllCompleted,
    markCompleted,
    markIncomplete,
    toggleStep,
    resetAll,
  }
}
