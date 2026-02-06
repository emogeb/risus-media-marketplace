import http from '@admin/lib/http'
import type { FulfillmentQueue } from '../types'

export async function getFulfillmentQueues(): Promise<FulfillmentQueue> {
  const { data } = await http.get<FulfillmentQueue>('/fulfillment/queues')
  return data
}
