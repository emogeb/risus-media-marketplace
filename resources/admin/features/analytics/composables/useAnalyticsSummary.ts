import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getAnalyticsSummary, type AnalyticsSummaryParams } from '../api/analytics.api'
import { useDashboardFiltersStore } from '@admin/stores/dashboardFilters'

export function useAnalyticsSummary() {
  const filtersStore = useDashboardFiltersStore()
  
  const params = computed<AnalyticsSummaryParams>(() => {
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
    queryKey: ['analyticsSummary', params.value],
    queryFn: () => getAnalyticsSummary(params.value),
  })
}
