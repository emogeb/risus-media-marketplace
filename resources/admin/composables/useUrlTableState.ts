import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type FieldType = 'string' | 'number' | 'boolean'

interface FieldSchema {
  type: FieldType
  default?: string | number | boolean
}

interface TableStateSchema {
  [key: string]: FieldSchema
}

/**
 * Syncs table state (filters, pagination) with URL query params
 * 
 * @param defaultState - Default state values
 * @param schema - Schema defining which fields to sync and their types
 * @returns Reactive state, setState, and resetState functions
 */
export function useUrlTableState<T extends Record<string, string | number | boolean | undefined>>(
  defaultState: T,
  schema: TableStateSchema
) {
  const route = useRoute()
  const router = useRouter()

  // Parse query param based on type
  function parseValue(value: string, type: FieldType): string | number | boolean | undefined {
    if (type === 'number') {
      const num = parseInt(value, 10)
      if (isNaN(num) || num <= 0) {
        return undefined
      }
      return num
    }
    if (type === 'boolean') {
      return value === 'true'
    }
    return value
  }

  // Serialize value to string for URL
  function serializeValue(value: string | number | boolean | null | undefined, type: FieldType): string | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined
    }
    if (type === 'number' && (typeof value !== 'number' || value <= 0)) {
      return undefined
    }
    if (type === 'boolean') {
      return value ? 'true' : undefined
    }
    return String(value)
  }

  // Parse initial state from URL
  function parseStateFromQuery(): T {
    const state = { ...defaultState }
    const query = route.query

    for (const [key, fieldSchema] of Object.entries(schema)) {
      if (query[key]) {
        const parsed = parseValue(query[key] as string, fieldSchema.type)
        if (parsed !== undefined) {
          state[key as keyof T] = parsed as T[keyof T]
        }
      }
    }

    return state
  }

  // Initialize state from URL or defaults
  const state = ref<T>(parseStateFromQuery())

  // Watch route query changes (browser back/forward)
  watch(
    () => route.query,
    (newQuery) => {
      const newState = parseStateFromQuery()
      // Only update if actually different
      if (JSON.stringify(newState) !== JSON.stringify(state.value)) {
        state.value = newState
      }
    },
    { deep: true }
  )

  // Watch state changes and update URL
  watch(
    state,
    (newState) => {
      const queryParams: Record<string, string> = {}
      
      for (const [key, fieldSchema] of Object.entries(schema)) {
        const value = newState[key as keyof T]
        const serialized = serializeValue(value, fieldSchema.type)
        if (serialized !== undefined) {
          queryParams[key] = serialized
        }
      }

      // Only update if different
      const currentQuery = route.query
      const queryChanged = JSON.stringify(currentQuery) !== JSON.stringify(queryParams)
      
      if (queryChanged) {
        router.replace({ query: queryParams })
      }
    },
    { deep: true }
  )

  function setState(updates: Partial<T>) {
    state.value = { ...state.value, ...updates }
  }

  function resetState() {
    state.value = { ...defaultState }
  }

  return {
    state,
    setState,
    resetState,
  }
}
