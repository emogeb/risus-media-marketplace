import { useQuery } from '@tanstack/vue-query'
import { getFulfillmentQueues } from '../api/fulfillment.api'
import type { FulfillmentQueue } from '../types'

export function useFulfillmentQueues() {
  return useQuery({
    queryKey: ['fulfillmentQueues'],
    queryFn: getFulfillmentQueues,
    select: (data): FulfillmentQueue => {
      // Ensure default shape if data is undefined or missing fields
      return {
        toPack: data?.toPack ?? [],
        toShip: data?.toShip ?? [],
        toPickup: data?.toPickup ?? [],
      }
    },
  })
}
