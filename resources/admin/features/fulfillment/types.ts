import type { Order } from '../orders/types'

export interface FulfillmentQueue {
  toPack: Order[]
  toShip: Order[]
  toPickup: Order[]
}
