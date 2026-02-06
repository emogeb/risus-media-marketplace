import { useQuery } from '@tanstack/vue-query'
import { getProduct } from '../api/products.api'
import type { Product } from '../types'

export function useProductQuery(id: string | (() => string)) {
  const idValue = typeof id === 'function' ? id() : id
  
  return useQuery<{ data: Product }>({
    queryKey: ['product', idValue],
    queryFn: () => getProduct(idValue),
    enabled: !!idValue,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    staleTime: 60_000,
  })
}
