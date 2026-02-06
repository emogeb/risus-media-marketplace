import { computed } from 'vue'
import { useDashboardSummary } from './useDashboardSummary'
import { useOrdersQuery } from '@admin/features/orders/composables/useOrdersQuery'
import { useProductsQuery } from '@admin/features/products/composables/useProductsQuery'
import type { Order } from '@admin/features/orders/types'
import type { Product } from '@admin/features/products/types'

export interface ActivityItem {
  id: string
  type: 'order' | 'product' | 'seller' | 'customer'
  title: string
  description?: string
  at?: string
  href?: string
}

/**
 * Safe number converter - ensures value is a valid number or null
 */
function safeNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null
  }
  if (typeof value === 'number') {
    return isNaN(value) || !isFinite(value) ? null : value
  }
  if (typeof value === 'string') {
    const parsed = Number(value)
    return isNaN(parsed) || !isFinite(parsed) ? null : parsed
  }
  return null
}

export function useDashboardOverview() {
  // Fetch all data
  const summaryQuery = useDashboardSummary()
  const ordersQuery = useOrdersQuery({ page: 1, pageSize: 5 })
  const productsQuery = useProductsQuery({ page: 1, pageSize: 100 })

  // Combined loading state
  const isLoading = computed(() => {
    return summaryQuery.isLoading.value || ordersQuery.isLoading.value || productsQuery.isLoading.value
  })

  // Combined error state
  const error = computed(() => {
    return summaryQuery.error.value || ordersQuery.error.value || productsQuery.error.value
  })

  // Refetch function
  function refetch() {
    summaryQuery.refetch()
    ordersQuery.refetch()
    productsQuery.refetch()
  }

  // KPIs - normalized from dashboard summary
  const kpis = computed(() => {
    if (!summaryQuery.data.value) return null
    return {
      totalRevenue: safeNumber(summaryQuery.data.value.totalRevenue),
      totalOrders: safeNumber(summaryQuery.data.value.totalOrders),
      pendingOrders: safeNumber(summaryQuery.data.value.pendingOrders),
      lowStockProducts: safeNumber(summaryQuery.data.value.lowStockProducts),
      revenueGrowth: safeNumber(summaryQuery.data.value.revenueGrowth),
      ordersGrowth: safeNumber(summaryQuery.data.value.ordersGrowth),
    }
  })

  const kpisIsEmpty = computed(() => {
    const k = kpis.value
    if (!k) return true
    return (
      k.totalRevenue === null &&
      k.totalOrders === null &&
      k.pendingOrders === null &&
      k.lowStockProducts === null
    )
  })

  // Recent Orders
  const recentOrders = computed<Order[]>(() => {
    return ordersQuery.data.value?.data || []
  })

  const recentOrdersIsEmpty = computed(() => {
    return recentOrders.value.length === 0
  })

  // Activity - empty for now, will be populated from API later
  const activity = computed<ActivityItem[]>(() => {
    return []
  })

  const activityIsEmpty = computed(() => {
    return activity.value.length === 0
  })

  // Revenue Series
  const revenueSeries = computed(() => {
    const series = summaryQuery.data.value?.revenueSeries
    if (!series || !Array.isArray(series) || series.length === 0) {
      return []
    }
    return series.map((point) => ({
      date: point?.date || '',
      revenue: safeNumber(point?.revenue) ?? 0,
    }))
  })

  const revenueSeriesIsEmpty = computed(() => {
    return revenueSeries.value.length === 0
  })

  // Low Stock Products
  const lowStock = computed<Product[]>(() => {
    const products = productsQuery.data.value?.data
    if (!products) return []
    // Filter products with stock <= 10
    return products.filter((product: Product) => product.stock <= 10)
  })

  const lowStockIsEmpty = computed(() => {
    return lowStock.value.length === 0
  })

  // Status Summary (for GlanceCard)
  const statusSummary = computed(() => {
    const summary = summaryQuery.data.value
    if (!summary) return null

    return {
      revenueToday: safeNumber(summary.totalRevenue),
      newOrders: safeNumber(summary.totalOrders),
      pendingPayments: safeNumber(summary.pendingOrders),
      lowStock: safeNumber(summary.lowStockProducts),
    }
  })

  const statusSummaryIsEmpty = computed(() => {
    const s = statusSummary.value
    if (!s) return true
    return (
      s.revenueToday === null &&
      s.newOrders === null &&
      s.pendingPayments === null &&
      s.lowStock === null
    )
  })

  return {
    // Loading & Error
    isLoading,
    error,
    refetch,

    // Data
    kpis,
    recentOrders,
    activity,
    revenueSeries,
    lowStock,
    statusSummary,

    // Empty states
    kpisIsEmpty,
    recentOrdersIsEmpty,
    activityIsEmpty,
    revenueSeriesIsEmpty,
    lowStockIsEmpty,
    statusSummaryIsEmpty,
  }
}
