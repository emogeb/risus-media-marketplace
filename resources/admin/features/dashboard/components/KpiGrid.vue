<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    <UiCard v-for="i in 4" :key="i" class="p-6">
      <UiSkeleton width="w-24" height="h-4" class="mb-3" />
      <UiSkeleton width="w-32" height="h-8" class="mb-2" />
      <UiSkeleton width="w-20" height="h-4" />
    </UiCard>
  </div>

  <!-- Error State -->
  <UiCard v-else-if="error" class="col-span-full">
    <div class="flex flex-col items-center justify-center text-center py-12">
      <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <svg
          class="w-8 h-8 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h4 class="text-base font-semibold text-gray-900 mb-2">{{ $t('dashboard.error.title') }}</h4>
      <p class="text-sm text-gray-600 max-w-md mb-6">{{ $t('dashboard.error.description') }}</p>
      <UiButton size="sm" variant="secondary" @click="handleRetry">
        {{ $t('dashboard.error.retry') }}
      </UiButton>
    </div>
  </UiCard>

  <!-- Empty State -->
  <UiCard v-else-if="isEmpty" class="col-span-full">
    <UiEmptyState
      :title="$t('dashboard.empty.kpi.title')"
      :description="$t('dashboard.empty.kpi.description')"
      :action-label="$t('dashboard.empty.kpi.cta')"
      action-to="/dashboard"
      variant="compact"
    >
      <template #icon>
        <svg
          class="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </template>
    </UiEmptyState>
  </UiCard>

  <!-- Content -->
  <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    <KpiCard
      :label="$t('dashboard.kpi.totalRevenue')"
      :value="kpis?.totalRevenue ?? null"
      icon="💰"
      :growth="kpis?.revenueGrowth"
      format="currency"
      :has-data="!!kpis"
    />
    <KpiCard
      :label="$t('dashboard.kpi.totalOrders')"
      :value="kpis?.totalOrders ?? null"
      icon="📦"
      :growth="kpis?.ordersGrowth"
      format="number"
      :has-data="!!kpis"
    />
    <KpiCard
      :label="$t('dashboard.kpi.pendingOrders')"
      :value="kpis?.pendingOrders ?? null"
      icon="⏳"
      format="number"
      :has-data="!!kpis"
    />
    <KpiCard
      :label="$t('dashboard.kpi.lowStock')"
      :value="kpis?.lowStockProducts ?? null"
      icon="⚠️"
      format="number"
      :has-data="!!kpis"
    />
  </div>
</template>

<script setup lang="ts">
import KpiCard from './KpiCard.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import UiButton from '@admin/components/ui/UiButton.vue'

interface KPIData {
  totalRevenue: number | null
  totalOrders: number | null
  pendingOrders: number | null
  lowStockProducts: number | null
  revenueGrowth: number | null
  ordersGrowth: number | null
}

const props = withDefaults(
  defineProps<{
    kpis?: KPIData | null
    isLoading?: boolean
    error?: boolean
    isEmpty?: boolean
  }>(),
  {
    isLoading: false,
    error: false,
    isEmpty: false,
  }
)

const emit = defineEmits<{
  retry: []
}>()

function handleRetry(): void {
  emit('retry')
}
</script>
