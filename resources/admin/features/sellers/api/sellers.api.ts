import http from '@admin/lib/http'
import { normalizeListResponse } from '@admin/lib/adapters/pagination'
import type {
  SellersResponse,
  SellersQueryParams,
  Seller,
  SellerProductsResponse,
  SellerProductsQueryParams,
} from '../types'
import type { RawListResponse } from '@admin/lib/apiTypes'

export async function getSellers(params?: SellersQueryParams): Promise<SellersResponse> {
  const { data } = await http.get<RawListResponse<Seller>>('/sellers', {
    params: {
      page: params?.page,
      pageSize: params?.pageSize,
      q: params?.q || params?.search,
      status: params?.status,
    },
  })
  const normalized = normalizeListResponse(data)
  
  return {
    data: normalized.items,
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  }
}

export async function getSellerDetail(id: string | number): Promise<Seller> {
  const { data } = await http.get<Seller>(`/sellers/${id}`)
  return data
}

export async function getSellerProducts(
  sellerId: string | number,
  params?: SellerProductsQueryParams
): Promise<SellerProductsResponse> {
  const { data } = await http.get<RawListResponse<import('../types').SellerProduct>>(
    `/sellers/${sellerId}/products`,
    {
      params: {
        page: params?.page,
        pageSize: params?.pageSize,
        q: params?.q,
        lowStock: params?.lowStock,
      },
    }
  )
  const normalized = normalizeListResponse(data)
  
  return {
    data: normalized.items,
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  }
}
