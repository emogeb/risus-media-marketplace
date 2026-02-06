export interface RevenueDataPoint {
  date: string
  revenue: number
}

export interface DashboardSummary {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  lowStockProducts: number
  revenueGrowth: number
  ordersGrowth: number
  revenueSeries: RevenueDataPoint[]
}
