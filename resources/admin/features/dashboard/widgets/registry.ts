export type DashboardWidgetId =
  | 'kpis'
  | 'production'
  | 'alerts'
  | 'revenue'
  | 'operations'
  | 'recentOrders'
  | 'lowStock'
  | 'activityLog'
  | 'setup'

export interface DashboardWidget {
  id: DashboardWidgetId
  titleKey: string
  descriptionKey: string
  defaultEnabled: boolean
  layoutType: 'full' | 'half'
}

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  {
    id: 'kpis',
    titleKey: 'dashboard.widgets.kpis.title',
    descriptionKey: 'dashboard.widgets.kpis.description',
    defaultEnabled: true,
    layoutType: 'full',
  },
  {
    id: 'production',
    titleKey: 'dashboard.widgets.production.title',
    descriptionKey: 'dashboard.widgets.production.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
  {
    id: 'alerts',
    titleKey: 'dashboard.widgets.alerts.title',
    descriptionKey: 'dashboard.widgets.alerts.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
  {
    id: 'revenue',
    titleKey: 'dashboard.widgets.revenue.title',
    descriptionKey: 'dashboard.widgets.revenue.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
  {
    id: 'operations',
    titleKey: 'dashboard.widgets.operations.title',
    descriptionKey: 'dashboard.widgets.operations.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
  {
    id: 'recentOrders',
    titleKey: 'dashboard.widgets.recentOrders.title',
    descriptionKey: 'dashboard.widgets.recentOrders.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
  {
    id: 'lowStock',
    titleKey: 'dashboard.widgets.lowStock.title',
    descriptionKey: 'dashboard.widgets.lowStock.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
  {
    id: 'activityLog',
    titleKey: 'dashboard.widgets.activityLog.title',
    descriptionKey: 'dashboard.widgets.activityLog.description',
    defaultEnabled: false,
    layoutType: 'half',
  },
  {
    id: 'setup',
    titleKey: 'dashboard.widgets.setup.title',
    descriptionKey: 'dashboard.widgets.setup.description',
    defaultEnabled: true,
    layoutType: 'half',
  },
]
