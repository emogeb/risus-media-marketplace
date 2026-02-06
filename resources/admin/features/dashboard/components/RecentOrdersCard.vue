<template>
  <UiCard>
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-900">{{ $t('dashboard.cards.recentOrders.title') }}</h3>
      <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.recentOrders.subtitle') }}</p>
    </div>
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 5" :key="i" height="h-12" />
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
    <DashboardEmptyState
      v-else-if="!orders || orders.length === 0"
      :title="$t('dashboard.empty.orders.title')"
      :description="$t('dashboard.empty.orders.description')"
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
            stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </template>
      <template #actions>
        <router-link :to="{ name: 'orders' }">
          <UiButton size="sm" variant="secondary">{{ $t('dashboard.empty.orders.cta') }}</UiButton>
        </router-link>
      </template>
    </DashboardEmptyState>

    <!-- Content -->
    <div v-else-if="orders.length > 0" class="space-y-3">
      <div
        v-for="order in orders.slice(0, 5)"
        :key="order.id"
        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg transition-colors duration-200 hover:bg-gray-50/50"
      >
        <div>
          <p class="font-medium text-gray-900">{{ order.orderNumber }}</p>
          <p class="text-sm text-gray-600">{{ order.customerName }}</p>
        </div>
        <div class="text-right">
          <p class="font-medium text-gray-900">{{ formatCurrency(order.total) }}</p>
          <OrderStatusBadge :status="order.status" />
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import DashboardEmptyState from './DashboardEmptyState.vue'
import OrderStatusBadge from '@admin/features/orders/components/OrderStatusBadge.vue'
import { formatCurrency } from '@admin/lib/format'

import type { Order } from '@admin/features/orders/types'

const props = withDefaults(
  defineProps<{
    orders?: Order[]
    isLoading?: boolean
    error?: boolean
  }>(),
  {
    orders: () => [],
    isLoading: false,
    error: false,
  }
)

const emit = defineEmits<{
  retry: []
}>()

function handleRetry(): void {
  emit('retry')
}

const orders = computed(() => props.orders || [])
</script>
