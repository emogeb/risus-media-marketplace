import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { getSellers } from '../api/sellers.api'
import type { SellersQueryParams } from '../types'

function normalizeParams(p?: SellersQueryParams) {
  if (!p) return undefined
  // undefined/null temizle + stabil sırala
  const entries = Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return Object.fromEntries(entries) as SellersQueryParams
}

function stableKey(p?: SellersQueryParams) {
  const normalized = normalizeParams(p)
  return normalized ? JSON.stringify(normalized) : 'all'
}

export function useSellersQuery(params?: SellersQueryParams | Ref<SellersQueryParams>) {
  const paramsValue = computed(() => {
    if (params && typeof params === 'object' && 'value' in params) {
      return (params as Ref<SellersQueryParams>).value
    }
    return params as SellersQueryParams | undefined
  })

  const key = computed(() => stableKey(paramsValue.value))
  const normalized = computed(() => normalizeParams(paramsValue.value))

  return useQuery({
    queryKey: computed(() => ['sellers', key.value]),
    queryFn: () => getSellers(normalized.value),
    staleTime: 10_000, // 10 sn
    placeholderData: (prev) => prev, // pagination'da flicker azaltır
  })
}
