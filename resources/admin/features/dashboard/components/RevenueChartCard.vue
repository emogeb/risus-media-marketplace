<template>
  <UiCard>
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-900">{{ $t('dashboard.cards.revenueTrend.title') }}</h3>
      <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.revenueTrend.subtitle') }}</p>
    </div>
    <div class="flex items-center justify-between mb-4">
      <div class="flex gap-2">
        <button
          :class="[
            'px-3 py-1 text-sm rounded-lg transition-colors',
            !hasChartData
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : selectedPeriod === '7d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          :disabled="!hasChartData"
          @click="selectedPeriod = '7d'"
        >
          7 Gün
        </button>
        <button
          :class="[
            'px-3 py-1 text-sm rounded-lg transition-colors',
            !hasChartData
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : selectedPeriod === '30d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          :disabled="!hasChartData"
          @click="selectedPeriod = '30d'"
        >
          30 Gün
        </button>
      </div>
    </div>
    <!-- Loading State -->
    <div v-if="isLoading" class="h-64">
      <UiSkeleton height="h-64" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="h-64 flex items-center justify-center">
      <div class="flex flex-col items-center justify-center text-center">
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
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasChartData" class="h-64">
      <UiEmptyState
        :title="$t('dashboard.empty.revenue.title')"
        :description="$t('dashboard.empty.revenue.description')"
        variant="compact"
      >
        <template #icon>
          <svg
            class="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </template>
        <template #actions>
          <router-link :to="{ name: 'orders' }">
            <UiButton size="sm" variant="secondary">{{ $t('dashboard.empty.revenue.cta') }}</UiButton>
          </router-link>
        </template>
      </UiEmptyState>
    </div>

    <!-- Content -->
    <div v-else class="h-64">
      <apexchart
        type="area"
        height="256"
        :options="chartOptions"
        :series="chartSeries"
      />
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { formatCurrency } from '@admin/lib/format'

import type { RevenueDataPoint } from '../types'

const props = withDefaults(
  defineProps<{
    revenueSeries?: RevenueDataPoint[]
    isLoading?: boolean
    error?: boolean
  }>(),
  {
    revenueSeries: () => [],
    isLoading: false,
    error: false,
  }
)

const emit = defineEmits<{
  retry: []
}>()

const selectedPeriod = ref<'7d' | '30d'>('7d')

function handleRetry(): void {
  emit('retry')
}

// Guard: revenueSeries undefined/boş kontrolü
const chartData = computed(() => {
  return props.revenueSeries || []
})

// Chart render kontrolü: sadece data varsa render et
const hasChartData = computed(() => {
  return chartData.value.length > 0 && !props.isLoading && !props.error
})

// ApexCharts için doğru format: categories ve series
const chartSeries = computed(() => {
  if (!hasChartData.value) {
    return [{ name: 'Revenue', data: [] }]
  }
  return [
    {
      name: 'Revenue',
      data: chartData.value.map((point) => point.revenue),
    },
  ]
})

const chartOptions = computed(() => {
  if (!hasChartData.value) {
    return {}
  }

  return {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    colors: ['#2563eb'],
    xaxis: {
      categories: chartData.value.map((point) => point.date),
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => formatCurrency(value),
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    dataLabels: {
      enabled: false,
    },
  }
})
</script>
