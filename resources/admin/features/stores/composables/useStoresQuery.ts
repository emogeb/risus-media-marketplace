import { computed, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getStores } from '../api/stores.api'
import type { StoreListResponse } from '../types'
import type { MaybeRef } from 'vue'

export interface StoresQueryParams extends Record<string, string | number | boolean | undefined> {
  page?: number
  pageSize?: number
  q?: string
  search?: string
  status?: 'active' | 'inactive'
}

export function useStoresQuery(params: MaybeRef<StoresQueryParams> = {}) {
  // Ensure params is reactive
  const queryParams = computed(() => unref(params))

  return useQuery<StoreListResponse>({
    queryKey: computed(() => ['stores', queryParams.value]),
    queryFn: () => getStores(queryParams.value),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    staleTime: 60_000,
  })
}
