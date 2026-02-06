import type { Role, Permission } from './types'

/**
 * Role to Permissions Mapping
 */
const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'orders.read',
    'orders.update',
    'products.read',
    'products.update',
    'products.write',
    'customers.read',
    'sellers.read',
    'stores.read',
    'stores.write',
    'fulfillment.read',
    'fulfillment.update',
    'analytics.read',
    'settings.read',
    'settings.update',
  ],
  staff: [
    'orders.read',
    'orders.update',
    'products.read',
    'products.update',
    'products.write',
    'customers.read',
    'sellers.read',
    'stores.read',
    'stores.write',
    'fulfillment.read',
    'fulfillment.update',
    'analytics.read',
    'settings.read',
  ],
  viewer: [
    'orders.read',
    'products.read',
    'customers.read',
    'sellers.read',
    'fulfillment.read',
    'analytics.read',
    'settings.read',
  ],
}

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissions[role] || []
}
