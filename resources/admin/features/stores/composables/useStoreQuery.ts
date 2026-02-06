import { useQuery } from '@tanstack/vue-query'
import { getStore } from '../api/stores.api'
import type { Store } from '../types'

export function useStoreQuery(id: string | (() => string)) {
  const idValue = typeof id === 'function' ? id() : id
  
  return useQuery<{ data: Store }>({
    queryKey: ['store', idValue],
    queryFn: () => getStore(idValue),
    enabled: !!idValue,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    staleTime: 60_000,
  })
}
