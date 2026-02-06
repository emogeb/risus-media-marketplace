/**
 * Role and Permission Types
 */

export type Role = 'admin' | 'staff' | 'viewer'

export type Permission =
  | 'orders.read'
  | 'orders.update'
  | 'products.read'
  | 'products.update'
  | 'products.write'
  | 'customers.read'
  | 'sellers.read'
  | 'stores.read'
  | 'stores.write'
  | 'fulfillment.read'
  | 'fulfillment.update'
  | 'analytics.read'
  | 'settings.read'
  | 'settings.update'
