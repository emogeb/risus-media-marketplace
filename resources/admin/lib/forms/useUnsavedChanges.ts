import { ref, type Ref } from 'vue'

// Global state for unsaved changes across the app
const globalHasChanges = ref(false)

/**
 * Composable for managing unsaved changes state
 * Provides utilities to track form changes and prompt user before navigation
 */
export function useUnsavedChanges() {
  const hasChanges = ref(false)
  let pendingConfirm: ((confirmed: boolean) => void) | null = null

  function markDirty() {
    hasChanges.value = true
    globalHasChanges.value = true
  }

  function markClean() {
    hasChanges.value = false
    // Only set global to false if no other forms have changes
    // This is a simple implementation - in a more complex app, you'd track per-form
    globalHasChanges.value = false
  }

  /**
   * Prompts user if there are unsaved changes
   * @param onConfirm Callback to execute if user confirms to proceed
   * @returns Promise that resolves to true if user confirmed, false otherwise
   */
  async function confirmIfDirty(onConfirm: () => void | Promise<void>): Promise<boolean> {
    if (!hasChanges.value) {
      await onConfirm()
      return true
    }

    // Return a promise that will be resolved by showing confirm modal
    return new Promise<boolean>((resolve) => {
      pendingConfirm = async (confirmed: boolean) => {
        if (confirmed) {
          await onConfirm()
        }
        resolve(confirmed)
        pendingConfirm = null
      }
      // Trigger modal show - component will handle this
      window.dispatchEvent(new CustomEvent('unsaved-changes-prompt'))
    })
  }

  /**
   * Get the pending confirmation callback (used by confirm modal)
   */
  function getPendingConfirm() {
    return pendingConfirm
  }

  return {
    hasChanges: hasChanges as Readonly<Ref<boolean>>,
    markDirty,
    markClean,
    confirmIfDirty,
    getPendingConfirm,
  }
}

/**
 * Get global unsaved changes state (for router guard)
 */
export function getGlobalHasChanges(): boolean {
  return globalHasChanges.value
}
