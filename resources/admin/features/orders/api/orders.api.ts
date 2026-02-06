import http from '@admin/lib/http'
import { normalizeListResponse } from '@admin/lib/adapters/pagination'
import type { Order, OrdersResponse, OrdersQueryParams } from '../types'
import type { RawListResponse } from '@admin/lib/apiTypes'

export async function getOrders(params?: OrdersQueryParams): Promise<OrdersResponse> {
  const { data } = await http.get<RawListResponse<Order>>('/orders', { params })
  const normalized = normalizeListResponse(data)
  
  return {
    data: normalized.items,
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  }
}

export async function getOrderById(id: string): Promise<Order> {
  const { data } = await http.get<Order>(`/orders/${id}`)
  return data
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
  const { data } = await http.patch<Order>(`/orders/${id}/status`, { status })
  return data
}
