import type { DashboardWidgetId } from '@admin/features/dashboard/widgets/registry'

export interface DashboardView {
  id: string
  name: string
  createdAt: string
  preferencesSnapshot: {
    enabled: Record<DashboardWidgetId, boolean>
    order: DashboardWidgetId[]
  }
  dateRangeSnapshot: {
    selectedDateRange: string
    customDateFrom?: string
    customDateTo?: string
  }
}
