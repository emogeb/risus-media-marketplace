export interface TopProduct {
  name: string
  sales: number
  revenue: number
}

export interface AnalyticsSummary {
  topProducts: TopProduct[]
  fulfillmentSplit: {
    shipping: number
    pickup: number
  }
}
