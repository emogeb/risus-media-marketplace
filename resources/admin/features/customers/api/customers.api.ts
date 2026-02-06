import http from '@admin/lib/http'
import { normalizeListResponse } from '@admin/lib/adapters/pagination'
import type { CustomersResponse, CustomersQueryParams } from '../types'
import type { RawListResponse } from '@admin/lib/apiTypes'
import type { Customer } from '../types'

export async function getCustomers(params?: CustomersQueryParams): Promise<CustomersResponse> {
  const { data } = await http.get<RawListResponse<Customer>>('/customers', {
    params: {
      type: params?.type,
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
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
