import http from '@admin/lib/http'
import { normalizeListResponse } from '@admin/lib/adapters/pagination'
import type { Product, ProductsResponse, ProductsQueryParams } from '../types'
import type { RawListResponse } from '@admin/lib/apiTypes'

export async function getProducts(params?: ProductsQueryParams): Promise<ProductsResponse> {
  // Support both 'q' and 'search' for compatibility
  const queryParams = params ? { ...params } : {}
  if (queryParams.search && !queryParams.q) {
    queryParams.q = queryParams.search
    delete queryParams.search
  }

  const { data } = await http.get<RawListResponse<Product>>('/products', { params: queryParams })
  const normalized = normalizeListResponse(data)

  return {
    data: normalized.items,
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  }
}

export async function getProduct(id: string): Promise<{ data: Product }> {
  const { data } = await http.get<{ data: Product }>(`/products/${id}`)
  return data
}

export async function createProduct(input: ProductCreateInput): Promise<{ data: Product }> {
  let payload: ProductCreateInput | FormData = input

  if (input.images && input.images.length > 0) {
    const formData = new FormData()
    Object.keys(input).forEach(key => {
      const value = input[key as keyof ProductCreateInput]
      if (key === 'images') {
        // Append each image file separately with same key 'images'
        // Laravel will automatically convert this to images[0], images[1], etc.
        input.images?.forEach(file => {
          formData.append('images[]', file, file.name)
        })
      } else if (value !== undefined && value !== null) {
        // Handle boolean values explicitly for Laravel validation
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0')
        } else if (value !== '') {
          // Skip empty strings but allow 0 and false
          formData.append(key, String(value))
        }
      }
    })
    payload = formData
  }

  const { data } = await http.post<{ data: Product }>('/products', payload)
  return data
}

export async function updateProduct(id: string, input: ProductUpdateInput): Promise<{ data: Product }> {
  // Update doesn't support images yet in this iteration, typically separate endpoint
  const { data } = await http.put<{ data: Product }>(`/products/${id}`, input)
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  await http.delete(`/products/${id}`)
}

export async function updateProductStock(id: string, stock: number): Promise<Product> {
  const { data } = await http.patch<Product>(`/products/${id}/stock`, { stock })
  return data
}

export interface ProductCreateInput {
  store_id: number
  title: string
  sku?: string
  description?: string
  price: number
  discount_rate?: number
  currency?: string
  stock: number
  status: 'draft' | 'active' | 'archived'
  category?: string
  category_id?: number
  made_to_order?: boolean
  lead_time_days?: number
  length?: number
  width?: number
  height?: number
  weight?: number
  size_info?: string
  images?: File[]
}

export type ProductUpdateInput = Partial<ProductCreateInput>
