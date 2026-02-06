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
  bank_iban?: string | null
  bank_qr_path?: string | null
  bank_qr_url?: string | null
  bank_swiss_code?: string | null
  logo_url?: string | null
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
  bank_iban?: string
  bank_swiss_code?: string
  bank_qr_code?: File
  owner: {
    name: string
    email: string
    company_name: string
    tax_number: string
  }
}

export type StoreUpdateInput = Partial<StoreCreateInput>
