/**
 * Generic API response types
 */

/**
 * Standard paginated list response
 */
export interface ApiListResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * Backend might return different formats, this is the raw response type
 */
export interface RawListResponse<T> {
  data?: T[]
  items?: T[]
  results?: T[]
  total?: number
  page?: number
  pageSize?: number
  per_page?: number
  current_page?: number
  meta?: {
    total?: number
    page?: number
    pageSize?: number
    per_page?: number
    current_page?: number
  }
  pagination?: {
    total?: number
    page?: number
    pageSize?: number
    per_page?: number
    current_page?: number
  }
}
