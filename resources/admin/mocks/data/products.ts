export interface MockProduct {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  lowStockThreshold: number
  category: string
  imageUrl?: string
}

export const mockProducts: MockProduct[] = [
  {
    id: '1',
    name: 'Klasik Beyaz Gelinlik',
    sku: 'GLN-001',
    price: 3500,
    stock: 5,
    lowStockThreshold: 10,
    category: 'Klasik',
  },
  {
    id: '2',
    name: 'Princess Gelinlik',
    sku: 'GLN-002',
    price: 4200,
    stock: 3,
    lowStockThreshold: 10,
    category: 'Princess',
  },
  {
    id: '3',
    name: 'Mermaid Gelinlik',
    sku: 'GLN-003',
    price: 3800,
    stock: 12,
    lowStockThreshold: 10,
    category: 'Mermaid',
  },
  {
    id: '4',
    name: 'A-Line Gelinlik',
    sku: 'GLN-004',
    price: 3200,
    stock: 8,
    lowStockThreshold: 10,
    category: 'A-Line',
  },
  {
    id: '5',
    name: 'Vintage Gelinlik',
    sku: 'GLN-005',
    price: 4500,
    stock: 2,
    lowStockThreshold: 10,
    category: 'Vintage',
  },
]
