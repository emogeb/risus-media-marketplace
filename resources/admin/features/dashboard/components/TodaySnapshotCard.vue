<template>
  <UiCard class="border-gray-200/60">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.widgets.todaySnapshot.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.widgets.todaySnapshot.description') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div v-for="i in 3" :key="i" class="space-y-3">
          <UiSkeleton height="h-4" width="w-20" />
          <UiSkeleton height="h-8" width="w-full" />
          <UiSkeleton height="h-8" width="w-full" />
          <UiSkeleton height="h-8" width="w-full" />
        </div>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Today Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">📅</span>
            <h4 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.widgets.todaySnapshot.columns.today.title') }}</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.today.orders') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(today.orders) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.today.revenue') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(today.revenue, 'currency') }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.today.returns') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(today.returns) }}</span>
            </div>
          </div>
        </div>

        <!-- Operations Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚙️</span>
            <h4 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.widgets.todaySnapshot.columns.operations.title') }}</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.operations.toPack') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(operations.toPack) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.operations.inTransit') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(operations.inTransit) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.operations.delivered') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(operations.delivered) }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">👥</span>
            <h4 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.widgets.todaySnapshot.columns.customer.title') }}</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.customer.newRegistration') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(customer.newRegistration) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.customer.newCompany') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(customer.newCompany) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.widgets.todaySnapshot.columns.customer.newSeller') }}</span>
              <span class="text-sm font-medium text-gray-900">{{ formatValue(customer.newSeller) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import { formatCurrency, formatNumber } from '@admin/lib/format'

interface TodaySnapshotData {
  today: {
    orders: number | null
    revenue: number | null
    returns: number | null
  }
  operations: {
    toPack: number | null
    inTransit: number | null
    delivered: number | null
  }
  customer: {
    newRegistration: number | null
    newCompany: number | null
    newSeller: number | null
  }
}

const props = withDefaults(
  defineProps<{
    data?: TodaySnapshotData
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
    data: () => ({
      today: { orders: null, revenue: null, returns: null },
      operations: { toPack: null, inTransit: null, delivered: null },
      customer: { newRegistration: null, newCompany: null, newSeller: null },
    }),
  }
)

const today = computed(() => props.data?.today || { orders: null, revenue: null, returns: null })
const operations = computed(() => props.data?.operations || { toPack: null, inTransit: null, delivered: null })
const customer = computed(() => props.data?.customer || { newRegistration: null, newCompany: null, newSeller: null })

function isInvalidNumber(value: number | null | undefined): boolean {
  if (value === null || value === undefined) return true
  if (typeof value !== 'number') return true
  return isNaN(value) || !isFinite(value)
}

function formatValue(value: number | null | undefined, type: 'number' | 'currency' = 'number'): string {
  if (isInvalidNumber(value)) {
    return '—'
  }
  return type === 'currency' ? formatCurrency(value as number) : formatNumber(value as number)
}
</script>
