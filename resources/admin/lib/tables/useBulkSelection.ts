import { ref, computed, type Ref } from 'vue'

/**
 * Composable for managing bulk selection in tables
 * Provides utilities to select/deselect items and track selection state
 */
export function useBulkSelection() {
  const selectedIds = ref<Set<string>>(new Set())

  /**
   * Toggle selection of a single item
   */
  function toggle(id: string) {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id)
    } else {
      selectedIds.value.add(id)
    }
  }

  /**
   * Toggle selection of all items in the provided array
   */
  function toggleAll(ids: string[]) {
    const allSelected = ids.every((id) => selectedIds.value.has(id))
    if (allSelected) {
      // Deselect all
      ids.forEach((id) => selectedIds.value.delete(id))
    } else {
      // Select all
      ids.forEach((id) => selectedIds.value.add(id))
    }
  }

  /**
   * Clear all selections
   */
  function clear() {
    selectedIds.value.clear()
  }

  /**
   * Check if an item is selected
   */
  function isSelected(id: string): boolean {
    return selectedIds.value.has(id)
  }

  /**
   * Check if all items in array are selected
   */
  function areAllSelected(ids: string[]): boolean {
    if (ids.length === 0) return false
    return ids.every((id) => selectedIds.value.has(id))
  }

  /**
   * Check if some (but not all) items are selected
   */
  function isIndeterminate(ids: string[]): boolean {
    const selectedCount = ids.filter((id) => selectedIds.value.has(id)).length
    return selectedCount > 0 && selectedCount < ids.length
  }

  /**
   * Get selected IDs as array
   */
  const selectedIdsArray = computed(() => Array.from(selectedIds.value))

  /**
   * Check if there are any selections
   */
  const hasSelection = computed(() => selectedIds.value.size > 0)

  /**
   * Get count of selected items
   */
  const selectionCount = computed(() => selectedIds.value.size)

  return {
    selectedIds: selectedIds as Readonly<Ref<Set<string>>>,
    selectedIdsArray,
    hasSelection,
    selectionCount,
    toggle,
    toggleAll,
    clear,
    isSelected,
    areAllSelected,
    isIndeterminate,
  }
}
