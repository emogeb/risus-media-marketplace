import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { getCustomers } from '../api/customers.api'
import type { CustomersQueryParams } from '../types'

function normalizeParams(p?: CustomersQueryParams) {
  if (!p) return undefined
  // undefined/null temizle + stabil sırala
  const entries = Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return Object.fromEntries(entries) as CustomersQueryParams
}

function stableKey(p?: CustomersQueryParams) {
  const normalized = normalizeParams(p)
  return normalized ? JSON.stringify(normalized) : 'all'
}

export function useCustomersQuery(params?: CustomersQueryParams | Ref<CustomersQueryParams>) {
  const paramsValue = computed(() => {
    if (params && typeof params === 'object' && 'value' in params) {
      return (params as Ref<CustomersQueryParams>).value
    }
    return params as CustomersQueryParams | undefined
  })

  const key = computed(() => stableKey(paramsValue.value))
  const normalized = computed(() => normalizeParams(paramsValue.value))

  return useQuery({
    queryKey: computed(() => ['customers', key.value]),
    queryFn: () => getCustomers(normalized.value),
    staleTime: 10_000, // 10 sn
    placeholderData: (prev) => prev, // pagination'da flicker azaltır
  })
}
