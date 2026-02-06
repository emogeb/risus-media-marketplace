export type ActivityAction =
  | 'order.update'
  | 'order.create'
  | 'order.delete'
  | 'product.update'
  | 'product.create'
  | 'product.delete'
  | 'seller.create'
  | 'seller.update'
  | 'seller.delete'
  | 'settings.update'
  | 'view.save'
  | 'view.delete'
  | 'customer.create'
  | 'customer.update'

export type ActivityEntityType = 'order' | 'product' | 'seller' | 'view' | 'customer' | 'settings'

export interface ActivityLog {
  id: string
  actorName: string
  actorRole: string
  action: ActivityAction
  entityType: ActivityEntityType
  entityId: string | null
  createdAt: string
  metadata?: Record<string, unknown>
}
