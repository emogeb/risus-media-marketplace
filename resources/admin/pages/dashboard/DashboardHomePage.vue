<template>
  <div class="min-h-screen">
    <div class="space-y-6 pb-12">
      <!-- Page Header (sadeleştirilmiş) -->
      <div class="mb-2">
        <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">{{ $t('dashboard.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.description') }}</p>
      </div>
      
      <!-- Dashboard Toolbar -->
      <DashboardToolbar />
      
      <!-- Master Grid: Tek 12 kolonlu grid -->
      <div class="grid grid-cols-12 gap-6">
        <!-- Sol Kolon: 8 kolon -->
        <div class="col-span-12 lg:col-span-8 space-y-6">
          <!-- KPI Grid -->
          <KpiGrid
            :kpis="kpis"
            :is-loading="isLoading"
            :error="!!error"
            :is-empty="kpisIsEmpty"
            @retry="handleRetry"
          />
          
          <!-- Activity Feed (KPI'nın hemen altında) -->
          <DashboardActivityCard
            :items="activity"
            :is-loading="isLoading"
            :error="!!error"
            @retry="handleRetry"
          />
          
          <!-- Revenue Chart -->
          <RevenueChartCard
            :revenue-series="revenueSeries"
            :is-loading="isLoading"
            :error="!!error"
            @retry="handleRetry"
          />
          
          <!-- Operasyon Checklist -->
          <DashboardChecklistCard />
        </div>
        
        <!-- Sağ Kolon: 4 kolon -->
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-6 self-start">
          <!-- Quick Actions -->
          <DashboardShortcutsCard />
          
          <!-- Durum Özeti -->
          <DashboardGlanceCard
            :values="statusSummary"
            :is-loading="isLoading"
            :error="!!error"
            :is-empty="statusSummaryIsEmpty"
            @retry="handleRetry"
          />
          
          <!-- Alerts -->
          <DashboardAlertsCard />
          
          <!-- Son Siparişler -->
          <RecentOrdersCard
            :orders="recentOrders"
            :is-loading="isLoading"
            :error="!!error"
            @retry="handleRetry"
          />
          
          <!-- Düşük Stok -->
          <LowStockCard
            :low-stock-products="lowStock"
            :is-loading="isLoading"
            :error="!!error"
            @retry="handleRetry"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardOverview } from '@admin/features/dashboard/composables/useDashboardOverview'
import DashboardToolbar from '@admin/features/dashboard/components/DashboardToolbar.vue'
import KpiGrid from '@admin/features/dashboard/components/KpiGrid.vue'
import DashboardGlanceCard from '@admin/features/dashboard/components/DashboardGlanceCard.vue'
import DashboardShortcutsCard from '@admin/features/dashboard/components/DashboardShortcutsCard.vue'
import DashboardAlertsCard from '@admin/features/dashboard/components/DashboardAlertsCard.vue'
import RevenueChartCard from '@admin/features/dashboard/components/RevenueChartCard.vue'
import RecentOrdersCard from '@admin/features/dashboard/components/RecentOrdersCard.vue'
import LowStockCard from '@admin/features/dashboard/components/LowStockCard.vue'
import DashboardActivityCard from '@admin/features/dashboard/components/DashboardActivityCard.vue'
import DashboardChecklistCard from '@admin/features/dashboard/components/DashboardChecklistCard.vue'

// Centralized data layer
const {
  isLoading,
  error,
  kpis,
  recentOrders,
  activity,
  revenueSeries,
  lowStock,
  statusSummary,
  kpisIsEmpty,
  recentOrdersIsEmpty,
  activityIsEmpty,
  revenueSeriesIsEmpty,
  lowStockIsEmpty,
  statusSummaryIsEmpty,
  refetch,
} = useDashboardOverview()

function handleRetry() {
  refetch()
}
</script>
