import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { getProducts } from '../api/products.api'
import type { ProductsQueryParams } from '../types'

export function useProductsQuery(params?: ProductsQueryParams | Ref<ProductsQueryParams>) {
  const paramsValue = computed(() => {
    if (params && typeof params === 'object' && 'value' in params) {
      return (params as Ref<ProductsQueryParams>).value
    }
    return params as ProductsQueryParams | undefined
  })

  return useQuery({
    queryKey: computed(() => ['products', paramsValue.value]),
    queryFn: () => getProducts(paramsValue.value),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    staleTime: 60_000, // 60 seconds
  })
}
