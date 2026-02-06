import { ref } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  title: string
  message?: string
  variant: ToastVariant
  duration: number
}

// Global state (singleton pattern)
const toasts = ref<Toast[]>([])

// Toast dedupe: prevent same error message from showing multiple times within 10 seconds
const lastShownToasts = new Map<string, number>()
const DEDUPE_WINDOW = 10_000 // 10 seconds

function addToast(toast: Omit<Toast, 'id'>) {
  // Create a unique key for deduplication (title + message)
  const dedupeKey = `${toast.variant}:${toast.title}:${toast.message || ''}`
  const now = Date.now()
  const lastShown = lastShownToasts.get(dedupeKey)

  // If same toast was shown within dedupe window, skip it
  if (lastShown && now - lastShown < DEDUPE_WINDOW) {
    return null
  }

  // Update last shown time
  lastShownToasts.set(dedupeKey, now)

  // Clean up old entries (older than 1 minute)
  for (const [key, timestamp] of lastShownToasts.entries()) {
    if (now - timestamp > 60_000) {
      lastShownToasts.delete(key)
    }
  }

  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const newToast: Toast = {
    id,
    ...toast,
  }
  toasts.value.push(newToast)

  if (newToast.duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }

  return id
}

function removeToast(id: string) {
  const index = toasts.value.findIndex((t) => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

function showSuccess(title: string, message?: string, duration = 3000) {
  return addToast({ title, message, variant: 'success', duration })
}

function showError(title: string, message?: string, duration = 5000) {
  return addToast({ title, message, variant: 'error', duration })
}

function showInfo(title: string, message?: string, duration = 3000) {
  return addToast({ title, message, variant: 'info', duration })
}

function showWarning(title: string, message?: string, duration = 4000) {
  return addToast({ title, message, variant: 'warning', duration })
}

// Export singleton functions for use outside Vue components
export const toastService = {
  addToast,
  removeToast,
  showSuccess,
  showError,
  showInfo,
  showWarning,
}

// Composable for Vue components
export function useToast() {
  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
