import { useQuery } from '@tanstack/vue-query'
import { getOrderById } from '../api/orders.api'

export function useOrderDetailQuery(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  })
}
