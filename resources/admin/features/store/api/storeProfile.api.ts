import http from '@admin/lib/http'
import type { StoreProfile, StoreProfileUpdateInput } from '../types'

export async function getStoreProfile(): Promise<{ data: StoreProfile }> {
  const { data } = await http.get<{ data: StoreProfile }>('/store/profile')
  return data
}

export async function updateStoreProfile(input: StoreProfileUpdateInput): Promise<{ data: StoreProfile }> {
  const { data } = await http.put<{ data: StoreProfile }>('/store/profile', input)
  return data
}
