import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Role, Permission } from '@admin/lib/auth/types'
import { getPermissionsForRole } from '@admin/lib/auth/permissions'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const role = ref<Role>('admin')

  // Initialize role from localStorage
  const storedRole = localStorage.getItem('role') as Role | null
  if (storedRole && ['admin', 'staff', 'viewer'].includes(storedRole)) {
    role.value = storedRole
  }

  // Permissions computed from role
  const permissions = computed<Permission[]>(() => {
    return getPermissionsForRole(role.value)
  })

  function setToken(newToken: string) {
    token.value = newToken
    // Persist to localStorage for http interceptor
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('token')
  }

  function setRole(newRole: Role) {
    role.value = newRole
    localStorage.setItem('role', newRole)
  }

  function hasPermission(permission: Permission): boolean {
    return permissions.value.includes(permission)
  }

  // Initialize from localStorage on store creation
  const storedToken = localStorage.getItem('token')
  if (storedToken) {
    token.value = storedToken
  }

  return {
    token,
    role,
    permissions,
    setToken,
    clearToken,
    setRole,
    hasPermission,
  }
})
