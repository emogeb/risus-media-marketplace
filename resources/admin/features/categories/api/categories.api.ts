import http from '@admin/lib/http'

export interface CategoryOption {
  id: number
  name: string
  slug: string
  parent_id?: number | null
}

export async function getCategories(): Promise<{ data: CategoryOption[] }> {
  const { data } = await http.get<{ data: CategoryOption[] }>('/categories')
  return data
}
