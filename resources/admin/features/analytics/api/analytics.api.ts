import http from '@admin/lib/http'
import type { AnalyticsSummary } from '../types'

export interface AnalyticsSummaryParams {
  range?: string
  from?: string
  to?: string
}

export async function getAnalyticsSummary(params?: AnalyticsSummaryParams): Promise<AnalyticsSummary> {
  const queryParams = new URLSearchParams()
  if (params?.range) queryParams.set('range', params.range)
  if (params?.from) queryParams.set('from', params.from)
  if (params?.to) queryParams.set('to', params.to)
  
  const queryString = queryParams.toString()
  const url = `/analytics/summary${queryString ? `?${queryString}` : ''}`
  
  const { data } = await http.get<AnalyticsSummary>(url)
  return data
}
