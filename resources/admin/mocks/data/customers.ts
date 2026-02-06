export interface MockCustomer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

export const mockCustomers: MockCustomer[] = [
  {
    id: '1',
    name: 'Ayşe Yılmaz',
    email: 'ayse@example.com',
    phone: '+90 555 123 4567',
    totalOrders: 3,
    totalSpent: 10500,
    lastOrderDate: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'Fatma Demir',
    email: 'fatma@example.com',
    phone: '+90 555 234 5678',
    totalOrders: 2,
    totalSpent: 8400,
    lastOrderDate: '2024-01-19T14:30:00Z',
  },
  {
    id: '3',
    name: 'Zeynep Kaya',
    email: 'zeynep@example.com',
    phone: '+90 555 345 6789',
    totalOrders: 1,
    totalSpent: 2800,
    lastOrderDate: '2024-01-18T09:15:00Z',
  },
]
