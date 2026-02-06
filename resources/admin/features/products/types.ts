export type ProductCategory = 'bridal' | 'evening' | 'accessory'
export type ProductAvailability = 'in_stock' | 'made_to_order' | 'preorder'

export interface ProductVariant {
  id: number
  sku: string
  price: number
  stock: number
  size?: string | null
  color?: string | null
}

export interface ProductAttribute {
  name: string
  code: string
  value: string
}

export interface Product {
  id: string
  store_id?: number
  store?: {
    id: number
    name: string
    slug: string
  }
  title?: string // Backend field
  name?: string // Legacy field (for backward compatibility)
  sku?: string | null
  description?: string | null
  price: number
  selling_price?: number
  discount_rate?: number
  currency?: string
  stock: number
  status?: 'draft' | 'active' | 'archived'
  // Legacy fields (for backward compatibility)
  lowStockThreshold?: number
  category?: string
  imageUrl?: string
  images?: {
    id: number
    url: string
    alt?: string
    is_primary?: boolean
  }[]
  designer?: string
  collection?: string
  silhouette?: string
  fabric?: string
  color?: string
  sizes?: string[]
  leadTimeDays?: number
  requiresAppointment?: boolean
  availability?: ProductAvailability
  // New fields for variants and attributes
  variants?: ProductVariant[]
  attributes?: ProductAttribute[]
  created_at?: string
  updated_at?: string
}

export interface ProductsResponse {
  data: Product[]
  total: number
  page?: number
  pageSize?: number
}

export interface ProductsQueryParams extends Record<string, string | number | boolean | undefined> {
  page?: number
  pageSize?: number
  q?: string
  search?: string
  status?: 'draft' | 'active' | 'archived'
  storeId?: string | number
  lowStock?: boolean
  category?: ProductCategory
  availability?: ProductAvailability
  requiresAppointment?: boolean
  sellerId?: string
}
