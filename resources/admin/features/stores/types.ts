export interface Store {
  id: number
  name: string
  slug: string
  category_ids: number[]
  description?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  hero_video_url?: string | null
  is_featured_on_hero?: boolean
  hero_order?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface StoreListResponse {
  data: Store[]
  total: number
  page: number
  pageSize: number
}

export interface StoreCreateInput {
  name: string
  category_ids: number[]
  slug?: string
  description?: string
  phone?: string
  email?: string
  address?: string
  logo_url?: string
  hero_video?: File
  is_featured_on_hero?: boolean
  status: 'active' | 'inactive'
  owner: {
    name: string
    email: string
    company_name: string
    tax_number: string
  }
}

export type StoreUpdateInput = Partial<StoreCreateInput>
