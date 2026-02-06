export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error'

export type NotificationType = 'order' | 'system' | 'alert' | 'reminder'

export interface Notification {
  id: string
  type: NotificationType
  severity: NotificationSeverity
  title: string
  message: string
  read: boolean
  createdAt: string
  metadata?: Record<string, unknown>
}
