/**
 * Date utility functions for order due date calculations
 */

/**
 * Check if a date is overdue (past today)
 */
export function isOverdue(date: string | Date | null | undefined): boolean {
  if (!date) return false
  const dueDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  return dueDate < today
}

/**
 * Check if a date is due soon (within specified days, default 7)
 */
export function isDueSoon(date: string | Date | null | undefined, days: number = 7): boolean {
  if (!date) return false
  const dueDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)
  
  const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilDue >= 0 && daysUntilDue <= days
}

/**
 * Format date as short string (e.g., "12 Mar")
 */
export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

/**
 * Format date as relative time (e.g., "5 dakika önce", "2 saat önce")
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) {
    return 'Az önce'
  } else if (diffMins < 60) {
    return `${diffMins} dakika önce`
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`
  } else {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
}

/**
 * Format date as readable string (e.g., "12 Mart 2024, 14:30")
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}
