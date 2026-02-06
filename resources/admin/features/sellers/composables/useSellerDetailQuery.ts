import { useQuery } from '@tanstack/vue-query'
import { getSellerDetail } from '../api/sellers.api'

export function useSellerDetailQuery(sellerId: string | number) {
  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => getSellerDetail(sellerId),
    enabled: !!sellerId,
  })
}
