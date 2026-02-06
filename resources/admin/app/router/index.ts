import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import DashboardLayout from '@admin/app/layouts/DashboardLayout.vue'
import { useAuthStore } from '@admin/stores/auth'
import { toastService } from '@admin/composables/useToast'
import { getGlobalHasChanges } from '@admin/lib/forms/useUnsavedChanges'
import type { Permission } from '@admin/lib/auth/types'

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@admin/pages/dashboard/DashboardHomePage.vue'),
          meta: { permissions: ['analytics.read'] as Permission[] },
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@admin/pages/orders/OrdersListPage.vue'),
          meta: { permissions: ['orders.read'] as Permission[] },
        },
        {
          path: 'fulfillment',
          name: 'fulfillment',
          component: () => import('@admin/pages/fulfillment/FulfillmentPage.vue'),
          meta: { permissions: ['fulfillment.read'] as Permission[] },
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@admin/pages/products/ProductsPage.vue'),
          meta: { permissions: ['products.read'] as Permission[] },
        },
        {
          path: 'customers/individual',
          name: 'customers-individual',
          component: () => import('@admin/pages/customers/IndividualCustomersPage.vue'),
          meta: { permissions: ['customers.read'] as Permission[] },
        },
        {
          path: 'customers/company',
          name: 'customers-company',
          component: () => import('@admin/pages/customers/CompanyCustomersPage.vue'),
          meta: { permissions: ['customers.read'] as Permission[] },
        },
        {
          path: 'sellers',
          name: 'sellers',
          component: () => import('@admin/pages/sellers/SellersPage.vue'),
          meta: { permissions: ['sellers.read'] as Permission[] },
        },
        {
          path: 'sellers/:sellerId',
          name: 'seller-detail',
          component: () => import('@admin/pages/sellers/SellerDetailPage.vue'),
          meta: { permissions: ['sellers.read'] as Permission[] },
        },
        {
          path: 'sellers/:sellerId/products',
          name: 'seller-products',
          component: () => import('@admin/pages/sellers/SellerProductsPage.vue'),
          meta: { permissions: ['products.read'] as Permission[] },
        },
        {
          path: 'stores',
          name: 'stores',
          component: () => import('@admin/pages/stores/StoresPage.vue'),
          meta: { permissions: ['stores.read'] as Permission[] },
        },
        {
          path: 'stores/new',
          name: 'store-create',
          component: () => import('@admin/pages/stores/StoreCreatePage.vue'),
          meta: { permissions: ['stores.write'] as Permission[] },
        },
        {
          path: 'stores/:id',
          name: 'store-detail',
          component: () => import('@admin/pages/stores/StoreDetailPage.vue'),
          meta: { permissions: ['stores.read'] as Permission[] },
        },
        {
          path: 'stores/:id/edit',
          name: 'store-edit',
          component: () => import('@admin/pages/stores/StoreEditPage.vue'),
          meta: { permissions: ['stores.write'] as Permission[] },
        },
        {
          path: 'products/new',
          name: 'product-create',
          component: () => import('@admin/pages/products/ProductCreatePage.vue'),
          meta: { permissions: ['products.write'] as Permission[] },
        },
        {
          path: 'products/:id/edit',
          name: 'product-edit',
          component: () => import('@admin/pages/products/ProductEditPage.vue'),
          meta: { permissions: ['products.write'] as Permission[] },
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('@admin/pages/analytics/AnalyticsPage.vue'),
          meta: { permissions: ['analytics.read'] as Permission[] },
        },
        {
          path: 'store/profile',
          name: 'store-profile',
          component: () => import('@admin/pages/store/StoreProfilePage.vue'),
          meta: { permissions: ['settings.read'] as Permission[] },
        },
        {
          path: 'store/settings',
          name: 'store-settings',
          component: () => import('@admin/pages/store/StoreSettingsPage.vue'),
          meta: { permissions: ['settings.read'] as Permission[] },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@admin/pages/settings/SettingsPage.vue'),
          meta: { permissions: ['settings.read'] as Permission[] },
        },
        {
          path: 'settings/integration-test',
          name: 'integration-test',
          component: () => import('@admin/pages/settings/IntegrationTestPage.vue'),
          // DEV only - production build'de bu route görünmez
        },
        {
          path: 'settings/home-video',
          name: 'settings-home-video',
          component: () => import('@admin/pages/settings/HomeVideoPage.vue'),
          meta: { permissions: ['stores.write'] as Permission[] },
        },
        {
          path: 'banners',
          name: 'banners',
          component: () => import('@admin/pages/banners/BannerList.vue'),
          meta: { permissions: ['stores.write'] as Permission[] },
        },
        {
          path: 'banners/create',
          name: 'banner-create',
          component: () => import('@admin/pages/banners/BannerForm.vue'),
          meta: { permissions: ['stores.write'] as Permission[] },
        },
        {
          path: 'banners/:id/edit',
          name: 'banner-edit',
          component: () => import('@admin/pages/banners/BannerForm.vue'),
          meta: { permissions: ['stores.write'] as Permission[] },
        },
      ],
    },
  ],
})

// Store pending navigation for unsaved changes confirmation
let pendingNavigation: {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
} | null = null

// Router guard - permission check and unsaved changes
router.beforeEach((to, from, next) => {
  // Check for unsaved changes
  if (getGlobalHasChanges() && from.name !== undefined) {
    // Store navigation and dispatch event to show confirm modal
    pendingNavigation = { to, from, next }
    window.dispatchEvent(new CustomEvent('route-change-with-unsaved'))
    // Navigation will be handled after confirmation
    return
  }

  const authStore = useAuthStore()
  const requiredPermissions = to.matched
    .map((record) => record.meta.permissions as Permission[] | undefined)
    .filter((perms): perms is Permission[] => !!perms)
    .flat()

  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every((perm) => authStore.hasPermission(perm))
    if (!hasAllPermissions) {
      toastService.showError('Yetkisiz Erişim', 'Bu sayfaya erişiminiz yok')
      next({ name: 'dashboard' })
      return
    }
  }

  next()
})

/**
 * Resolve pending navigation after unsaved changes confirmation
 */
export function resolvePendingNavigation(confirmed: boolean) {
  if (pendingNavigation) {
    if (confirmed) {
      pendingNavigation.next()
    } else {
      pendingNavigation.next(false)
    }
    pendingNavigation = null
  }
}

export default router
