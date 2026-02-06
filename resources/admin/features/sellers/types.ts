export interface Seller {
  id: string
  name: string
  slug?: string
  email?: string
  phone?: string
  companyName?: string
  taxNumber?: string
  city?: string
  totalProducts?: number
  totalSales?: number
  status?: 'active' | 'inactive' | 'pending'
  createdAt?: string
}

export interface SellerProduct {
  id: string
  title: string
  sku?: string
  price?: number
  stock?: number
  status?: string
  updatedAt?: string
}

export interface SellersResponse {
  data: Seller[]
  total: number
  page: number
  pageSize: number
}

export interface SellersQueryParams extends Record<string, string | number | boolean | undefined> {
  page?: number
  pageSize?: number
  q?: string
  search?: string
  status?: Seller['status']
}

export interface SellerProductsResponse {
  data: SellerProduct[]
  total: number
  page: number
  pageSize: number
}

export interface SellerProductsQueryParams {
  page?: number
  pageSize?: number
  q?: string
  lowStock?: boolean
}
