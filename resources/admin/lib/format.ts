/**
 * Safe currency formatter - never returns NaN or undefined
 * Returns "—" for invalid values, "₺0,00" for null/undefined
 */
export function formatCurrency(value: number | null | undefined, options?: Intl.NumberFormatOptions): string {
  // Guard: Only process valid numbers
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value !== 'number') {
    return '—'
  }
  if (isNaN(value) || !isFinite(value)) {
    return '—'
  }
  // Safe to call Intl.NumberFormat - value is guaranteed to be a valid number
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    ...options,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Safe number formatter - never returns NaN or undefined
 * Returns "—" for invalid values
 */
export function formatNumber(value: number | null | undefined): string {
  // Guard: Only process valid numbers
  if (value === null || value === undefined) {
    return '—'
  }
  if (typeof value !== 'number') {
    return '—'
  }
  if (isNaN(value) || !isFinite(value)) {
    return '—'
  }
  // Safe to call Intl.NumberFormat - value is guaranteed to be a valid number
  return new Intl.NumberFormat('tr-TR').format(value)
}
