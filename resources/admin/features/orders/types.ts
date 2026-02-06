export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded'
export type FulfillmentType = 'shipping' | 'pickup'

export type BridalStatus =
  | 'new'
  | 'measurement_pending'
  | 'measurement_done'
  | 'fitting_1_scheduled'
  | 'fitting_1_done'
  | 'alteration_in_progress'
  | 'fitting_2_scheduled'
  | 'ready_for_pickup'
  | 'shipped'
  | 'completed'
  | 'cancelled'

export interface Appointment {
  date?: string
  type?: 'measurement' | 'fitting_1' | 'fitting_2'
  notes?: string
}

export interface Measurements {
  bust?: number
  waist?: number
  hip?: number
  height?: number
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentType: FulfillmentType
  createdAt: string
  updatedAt: string
  // Bridal workflow fields (optional for backward compatibility)
  bridalStatus?: BridalStatus
  appointment?: Appointment
  measurements?: Measurements
  deliveryMethod?: 'shipping' | 'store_pickup'
  dueDate?: string
}

export interface OrdersResponse {
  data: Order[]
  total: number
  page: number
  pageSize: number
}

export interface OrdersQueryParams extends Record<string, string | number | boolean | undefined> {
  page?: number
  pageSize?: number
  status?: OrderStatus
  payment_status?: PaymentStatus
  fulfillment_type?: FulfillmentType
  from?: string
  to?: string
  bridalStatus?: BridalStatus
  bridal_status?: BridalStatus
}
