import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { getSellerProducts } from '../api/sellers.api'
import type { SellerProductsQueryParams } from '../types'

function normalizeParams(p?: SellerProductsQueryParams) {
  if (!p) return undefined
  const entries = Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b))
  return Object.fromEntries(entries) as SellerProductsQueryParams
}

function stableKey(p?: SellerProductsQueryParams) {
  const normalized = normalizeParams(p)
  return normalized ? JSON.stringify(normalized) : 'all'
}

export function useSellerProductsQuery(
  sellerId: string | number,
  params?: SellerProductsQueryParams | Ref<SellerProductsQueryParams>
) {
  const paramsValue = computed(() => {
    if (params && typeof params === 'object' && 'value' in params) {
      return (params as Ref<SellerProductsQueryParams>).value
    }
    return params as SellerProductsQueryParams | undefined
  })

  const key = computed(() => stableKey(paramsValue.value))
  const normalized = computed(() => normalizeParams(paramsValue.value))

  return useQuery({
    queryKey: computed(() => ['seller-products', sellerId, key.value]),
    queryFn: () => getSellerProducts(sellerId, normalized.value),
    enabled: !!sellerId,
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  })
}
