import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getDashboardSummary, type DashboardSummaryParams } from '../api/dashboard.api'
import { useDashboardFiltersStore } from '@admin/stores/dashboardFilters'

export function useDashboardSummary() {
  const filtersStore = useDashboardFiltersStore()
  
  const params = computed<DashboardSummaryParams>(() => {
    const range = filtersStore.selectedDateRange
    if (range === 'custom') {
      return {
        range: 'custom',
        from: filtersStore.customDateFrom,
        to: filtersStore.customDateTo,
      }
    }
    return { range }
  })
  
  return useQuery({
    queryKey: ['dashboardSummary', params.value],
    queryFn: () => getDashboardSummary(params.value),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    staleTime: 60_000, // 60 seconds
  })
}
