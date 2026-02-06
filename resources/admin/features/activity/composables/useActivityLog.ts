import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getActivityLogs } from '../api/activity.api'
import type { ActivityLog } from '../types'

export function useActivityLog(limit: number = 10) {
  const {
    data: logs,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['activity-logs', limit],
    queryFn: () => getActivityLogs({ limit }),
    // TODO: Backend API hazır olunca refetchInterval kaldırılacak
    // refetchInterval: 30000, // 30 saniyede bir yenile
  })

  return {
    logs: computed(() => logs.value || []),
    isLoading,
    isError,
    error,
  }
}
