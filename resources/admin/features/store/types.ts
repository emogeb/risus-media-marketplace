export interface StoreProfile {
  id: number
  name: string
  description?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  logo_url?: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface StoreProfileUpdateInput {
  name?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  logo_url?: string
  status?: 'active' | 'inactive'
}
