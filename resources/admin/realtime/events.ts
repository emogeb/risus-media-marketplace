export type RealtimeEvent = 
  | { type: 'order.created'; payload: { orderId: string } }
  | { type: 'order.updated'; payload: { orderId: string } }
  | { type: 'inventory.low_stock'; payload: { productId: string } }

export type RealtimeEventHandler = (event: RealtimeEvent) => void
