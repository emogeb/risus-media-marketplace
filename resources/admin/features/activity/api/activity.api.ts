// TODO: Backend API entegrasyonu eklenecek
// GET /api/activity/logs?limit=10&offset=0

import type { ActivityLog } from '../types'

export async function getActivityLogs(params: {
  limit?: number
  offset?: number
}): Promise<ActivityLog[]> {
  // TODO: API çağrısı yapılacak
  // const response = await http.get('/activity/logs', { params })
  // return response.data
  return []
}
