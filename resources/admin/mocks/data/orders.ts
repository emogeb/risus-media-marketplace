export interface MockOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  fulfillmentType: 'shipping' | 'pickup'
  createdAt: string
  updatedAt: string
}

export const mockOrders: MockOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Ayşe Yılmaz',
    customerEmail: 'ayse@example.com',
    total: 3500,
    status: 'pending',
    paymentStatus: 'paid',
    fulfillmentType: 'shipping',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Fatma Demir',
    customerEmail: 'fatma@example.com',
    total: 4200,
    status: 'confirmed',
    paymentStatus: 'paid',
    fulfillmentType: 'pickup',
    createdAt: '2024-01-19T14:30:00Z',
    updatedAt: '2024-01-19T15:00:00Z',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Zeynep Kaya',
    customerEmail: 'zeynep@example.com',
    total: 2800,
    status: 'processing',
    paymentStatus: 'paid',
    fulfillmentType: 'shipping',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-19T11:20:00Z',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customerName: 'Elif Şahin',
    customerEmail: 'elif@example.com',
    total: 5500,
    status: 'shipped',
    paymentStatus: 'paid',
    fulfillmentType: 'shipping',
    createdAt: '2024-01-17T16:45:00Z',
    updatedAt: '2024-01-20T08:30:00Z',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customerName: 'Merve Öztürk',
    customerEmail: 'merve@example.com',
    total: 3200,
    status: 'delivered',
    paymentStatus: 'paid',
    fulfillmentType: 'pickup',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
  },
]
