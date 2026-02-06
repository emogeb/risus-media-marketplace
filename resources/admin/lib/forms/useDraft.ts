import { ref, watch, type Ref } from 'vue'
import { debounce } from '@admin/lib/utils'

/**
 * Composable for managing form drafts with localStorage
 * Automatically saves form state to localStorage and restores on load
 */
export function useDraft<T extends Record<string, unknown>>(key: string, initialState: T) {
  const storageKey = `draft:${key}`
  const formState = ref<T>({ ...initialState }) as Ref<T>

  /**
   * Load draft from localStorage
   */
  function loadDraft(): T | null {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as T
        formState.value = { ...parsed }
        return parsed
      }
    } catch (error) {
      console.warn('Failed to load draft:', error)
    }
    return null
  }

  /**
   * Save draft to localStorage
   */
  function saveDraft() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(formState.value))
    } catch (error) {
      console.warn('Failed to save draft:', error)
    }
  }

  /**
   * Clear draft from localStorage
   */
  function clearDraft() {
    try {
      localStorage.removeItem(storageKey)
      formState.value = { ...initialState }
    } catch (error) {
      console.warn('Failed to clear draft:', error)
    }
  }

  /**
   * Debounced autosave function
   */
  const debouncedSave = debounce(saveDraft, 500)

  /**
   * Watch form state and autosave on changes
   */
  function enableAutosave() {
    watch(
      formState,
      () => {
        debouncedSave()
      },
      { deep: true }
    )
  }

  return {
    formState,
    loadDraft,
    saveDraft,
    clearDraft,
    enableAutosave,
  }
}
