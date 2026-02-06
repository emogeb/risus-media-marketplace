import http from '@admin/lib/http'
import { normalizeListResponse } from '@admin/lib/adapters/pagination'
import type { Store, StoreListResponse, StoreCreateInput, StoreUpdateInput } from '../types'
import type { RawListResponse } from '@admin/lib/apiTypes'

export async function getStores(params?: {
  page?: number
  pageSize?: number
  q?: string
  search?: string
  status?: 'active' | 'inactive'
}): Promise<StoreListResponse> {
  // Support both 'q' and 'search' for compatibility
  const queryParams = params ? { ...params } : {}
  if (queryParams.search && !queryParams.q) {
    queryParams.q = queryParams.search
    delete queryParams.search
  }
  const { data } = await http.get<RawListResponse<Store>>('/stores', { params: queryParams })
  const normalized = normalizeListResponse(data)

  return {
    data: normalized.items,
    total: normalized.total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  }
}

export async function getStore(id: string): Promise<{ data: Store }> {
  const { data } = await http.get<{ data: Store }>(`/stores/${id}`)
  return data
}

// Helper to build FormData
function buildFormData(input: StoreCreateInput | StoreUpdateInput): FormData {
  const fd = new FormData()
  Object.keys(input).forEach(key => {
    const value = (input as any)[key]
    if (value === undefined || value === null) return

    if (key === 'owner') {
      Object.keys(value).forEach(oKey => {
        fd.append(`owner[${oKey}]`, value[oKey])
      })
    } else if (key === 'category_ids' && Array.isArray(value)) {
      value.forEach((id: number, index: number) => {
        fd.append(`category_ids[${index}]`, id.toString())
      })
    } else if (key === 'hero_video') {
      if (value instanceof File) {
        fd.append('hero_video', value)
      }
    } else if (key === 'is_featured_on_hero') {
      fd.append('is_featured_on_hero', value ? '1' : '0')
    } else {
      fd.append(key, value)
    }
  })
  return fd
}

export async function createStore(input: StoreCreateInput): Promise<{ data: Store }> {
  if (input.hero_video instanceof File) {
    const payload = buildFormData(input)
    const { data } = await http.post<{ data: Store }>('/stores', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }
  const { data } = await http.post<{ data: Store }>('/stores', input)
  return data
}

export async function updateStore(id: string, input: StoreUpdateInput): Promise<{ data: Store }> {
  if (input.hero_video instanceof File) {
    const payload = buildFormData(input)
    payload.append('_method', 'PUT')
    const { data } = await http.post<{ data: Store }>(`/stores/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }
  const { data } = await http.put<{ data: Store }>(`/stores/${id}`, input)
  return data
}

export async function deleteStore(id: string): Promise<void> {
  await http.delete(`/stores/${id}`)
}

export async function reorderStores(items: { id: number; order: number }[]): Promise<void> {
  await http.put('/stores/reorder', { items })
}
