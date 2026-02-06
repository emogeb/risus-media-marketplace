import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { getOrders } from '../api/orders.api'
import type { OrdersQueryParams } from '../types'

function normalizeParams(p?: OrdersQueryParams) {
  if (!p) return undefined
  // undefined/null temizle + stabil sırala
  const entries = Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return Object.fromEntries(entries) as OrdersQueryParams
}

function stableKey(p?: OrdersQueryParams) {
  const normalized = normalizeParams(p)
  return normalized ? JSON.stringify(normalized) : 'all'
}

export function useOrdersQuery(params?: OrdersQueryParams | Ref<OrdersQueryParams>) {
  const paramsValue = computed(() => {
    if (params && typeof params === 'object' && 'value' in params) {
      return (params as Ref<OrdersQueryParams>).value
    }
    return params as OrdersQueryParams | undefined
  })

  const key = computed(() => stableKey(paramsValue.value))
  const normalized = computed(() => normalizeParams(paramsValue.value))

  return useQuery({
    queryKey: computed(() => ['orders', key.value]),
    queryFn: () => getOrders(normalized.value),
    staleTime: 60_000, // 60 seconds
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    placeholderData: (prev) => prev, // pagination'da flicker azaltır
  })
}
