import http from '@admin/lib/http'
import type { DashboardSummary } from '../types'

export interface DashboardSummaryParams {
  range?: string
  from?: string
  to?: string
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

/**
 * Normalize API response to ensure all numeric fields are safe
 */
function normalizeDashboardSummary(data: unknown): DashboardSummary {
  const apiData = data as Record<string, unknown> | null | undefined
  const revenueSeries = apiData?.revenueSeries
  
  return {
    totalRevenue: safeNumber(apiData?.totalRevenue) ?? 0,
    totalOrders: safeNumber(apiData?.totalOrders) ?? 0,
    pendingOrders: safeNumber(apiData?.pendingOrders) ?? 0,
    lowStockProducts: safeNumber(apiData?.lowStockProducts) ?? 0,
    revenueGrowth: safeNumber(apiData?.revenueGrowth) ?? 0,
    ordersGrowth: safeNumber(apiData?.ordersGrowth) ?? 0,
    revenueSeries: Array.isArray(revenueSeries) 
      ? revenueSeries.map((point: unknown) => {
          const p = point as Record<string, unknown> | null | undefined
          return {
            date: typeof p?.date === 'string' ? p.date : '',
            revenue: safeNumber(p?.revenue) ?? 0,
          }
        })
      : [],
  }
}

export async function getDashboardSummary(params?: DashboardSummaryParams): Promise<DashboardSummary> {
  const queryParams = new URLSearchParams()
  if (params?.range) queryParams.set('range', params.range)
  if (params?.from) queryParams.set('from', params.from)
  if (params?.to) queryParams.set('to', params.to)
  
  const queryString = queryParams.toString()
  const url = `/dashboard/summary${queryString ? `?${queryString}` : ''}`
  
  const { data } = await http.get<unknown>(url)
  return normalizeDashboardSummary(data)
}
