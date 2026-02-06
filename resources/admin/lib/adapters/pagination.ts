import type { ApiListResponse, RawListResponse } from '../apiTypes'

/**
 * Normalizes backend list response to standard format
 * Handles different backend response formats and converts to unified structure
 * 
 * Supported input formats:
 * A) { items, total, page, pageSize }
 * B) { data, total, page, pageSize }
 * C) { data, meta: { total, page, per_page|pageSize } }
 * D) { data, pagination: { total, page, pageSize } }
 * E) Laravel paginate: { data, current_page, per_page, total }
 * 
 * Output format (ALWAYS):
 * { items, total, page, pageSize }
 */
export function normalizeListResponse<T>(
  input: RawListResponse<T> | ApiListResponse<T>
): ApiListResponse<T> {
  // Guard: input must be an object, not string/HTML
  if (typeof input === 'string' || input instanceof HTMLElement) {
    throw new Error('Expected JSON object but received string/HTML. Check VITE_API_BASE_URL or ensure MSW is enabled.')
  }

  // Format A: Already in correct format { items, total, page, pageSize }
  if ('items' in input && 'page' in input && 'pageSize' in input && typeof input.total === 'number') {
    return input as ApiListResponse<T>
  }

  // Extract items: prioritize items, then data, then results
  const items = (input.items || input.data || input.results || []) as T[]

  // Extract total: try multiple sources
  // Format B: { data, total, page, pageSize } - total at root
  // Format C: { data, meta: { total, page, per_page } } - total in meta
  // Format D: { data, pagination: { total, page, pageSize } } - total in pagination
  // Format E: Laravel { data, current_page, per_page, total } - total at root
  const total =
    input.total ||
    input.meta?.total ||
    input.pagination?.total ||
    items.length ||
    0

  // Extract page: try multiple sources
  // Format B: { data, total, page, pageSize } - page at root
  // Format C: { data, meta: { total, page, per_page } } - page in meta
  // Format D: { data, pagination: { total, page, pageSize } } - page in pagination
  // Format E: Laravel { data, current_page, per_page, total } - current_page at root
  const page =
    input.page ||
    input.current_page ||
    input.meta?.page ||
    input.meta?.current_page ||
    input.pagination?.page ||
    input.pagination?.current_page ||
    1

  // Extract pageSize: try multiple sources
  // Format B: { data, total, page, pageSize } - pageSize at root
  // Format C: { data, meta: { total, page, per_page|pageSize } } - per_page or pageSize in meta
  // Format D: { data, pagination: { total, page, pageSize } } - pageSize in pagination
  // Format E: Laravel { data, current_page, per_page, total } - per_page at root
  const pageSize =
    input.pageSize ||
    input.per_page ||
    input.meta?.pageSize ||
    input.meta?.per_page ||
    input.pagination?.pageSize ||
    input.pagination?.per_page ||
    items.length ||
    10

  // ALWAYS return normalized format: { items, total, page, pageSize }
  return {
    items,
    total,
    page,
    pageSize,
  }
}
