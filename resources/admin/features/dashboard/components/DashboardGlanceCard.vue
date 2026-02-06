<template>
  <UiCard>
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.glance.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.glance.description') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <UiSkeleton v-for="i in 4" :key="i" width="w-full" height="h-20" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-8">
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
      <UiEmptyState
        v-else-if="props.isEmpty"
        :title="$t('dashboard.empty.glance.title')"
        :description="$t('dashboard.empty.glance.description')"
        :action-label="$t('dashboard.empty.glance.cta')"
        action-to="/dashboard"
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
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </template>
      </UiEmptyState>

      <!-- Content -->
      <div v-else class="grid grid-cols-2 gap-4">
        <!-- Revenue Today -->
        <div class="flex flex-col p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">💰</span>
            <span class="text-xs font-medium text-gray-500">{{ $t('dashboard.glance.items.revenueToday.label') }}</span>
          </div>
          <p class="text-xl font-bold text-gray-900 tracking-tight">{{ formatValue(props.values?.revenueToday, 'compact-currency') }}</p>
        </div>

        <!-- New Orders -->
        <div class="flex flex-col p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">📦</span>
            <span class="text-xs font-medium text-gray-500">{{ $t('dashboard.glance.items.newOrders.label') }}</span>
          </div>
          <p class="text-xl font-bold text-gray-900 tracking-tight">{{ formatValue(props.values?.newOrders) }}</p>
        </div>

        <!-- Pending Payments -->
        <div class="flex flex-col p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">💳</span>
            <span class="text-xs font-medium text-gray-500">{{ $t('dashboard.glance.items.pendingPayments.label') }}</span>
          </div>
          <p class="text-xl font-bold text-gray-900 tracking-tight">{{ formatValue(props.values?.pendingPayments) }}</p>
        </div>

        <!-- Low Stock -->
        <div class="flex flex-col p-3 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors border border-gray-100/50">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">⚠️</span>
            <span class="text-xs font-medium text-gray-500">{{ $t('dashboard.glance.items.lowStock.label') }}</span>
          </div>
          <p class="text-xl font-bold text-gray-900 tracking-tight">{{ formatValue(props.values?.lowStock) }}</p>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { formatCurrency } from '@admin/lib/format'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'

interface GlanceValues {
  revenueToday?: string | number
  newOrders?: number
  pendingPayments?: number
  lowStock?: number
}

const props = withDefaults(
  defineProps<{
    values?: GlanceValues
    isLoading?: boolean
    error?: boolean
    isEmpty?: boolean
  }>(),
  {
    values: () => ({}),
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

function formatValue(value: string | number | null | undefined, type: 'currency' | 'number' | 'compact-currency' = 'number'): string {
  if (value === null || value === undefined) {
    return '—'
  }

  // Handle compact currency (e.g., 222k)
  if (type === 'compact-currency') {
    const numValue = typeof value === 'string' ? Number(value) : value
    if (typeof numValue === 'number' && !isNaN(numValue) && isFinite(numValue)) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(numValue)
    }
    return typeof value === 'string' ? value : '—'
  }

  if (type === 'currency') {
    // Try to convert to number if it's a string
    const numValue = typeof value === 'string' ? Number(value) : value
    if (typeof numValue === 'number' && !isNaN(numValue) && isFinite(numValue)) {
      return formatCurrency(numValue)
    }
    // If formatCurrency doesn't work, return as is or "—"
    return typeof value === 'string' ? value : '—'
  }

  // For number type
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      return '—'
    }
    return value.toString()
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed.toString()
    }
    return value
  }

  return '—'
}
</script>
