<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <!-- Son Siparişler -->
    <UiCard>
      <div class="space-y-4">
        <!-- Header -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.operational.recentOrders.title') }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.operational.recentOrders.description') }}</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-3">
          <UiSkeleton v-for="i in 5" :key="i" width="w-full" height="h-16" />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="py-8">
          <div class="flex flex-col items-center justify-center text-center">
            <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-amber-600"
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
            <h4 class="text-sm font-semibold text-gray-900 mb-1">{{ $t('dashboard.operational.recentOrders.error.title') }}</h4>
            <p class="text-xs text-gray-600 max-w-sm mb-4">{{ $t('dashboard.operational.recentOrders.error.description') }}</p>
            <UiButton size="sm" variant="secondary" @click="handleRetry">
              {{ $t('dashboard.operational.recentOrders.error.retry') }}
            </UiButton>
          </div>
        </div>

        <!-- Empty State -->
        <UiEmptyState
          v-else-if="!orders || orders.length === 0"
          :title="$t('dashboard.operational.recentOrders.empty.title')"
          :description="$t('dashboard.operational.recentOrders.empty.description')"
          variant="compact"
        />

        <!-- Orders List -->
        <div v-else class="space-y-3">
          <div
            v-for="order in orders"
            :key="order.id"
            class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            @click="handleOrderClick(order.id)"
          >
            <!-- Left: Customer + ID -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ order.customerName }}</p>
              <p class="text-xs text-gray-500 mt-0.5">#{{ order.id }}</p>
            </div>

            <!-- Right: Total + Status -->
            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(order.total) }}</span>
              <UiBadge :variant="getStatusVariant(order.status)">{{ order.status }}</UiBadge>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- Bugün Yapılacaklar -->
    <UiCard>
      <div class="space-y-4">
        <!-- Header -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.operational.todo.title') }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.operational.todo.description') }}</p>
        </div>

        <!-- Empty State -->
        <UiEmptyState
          v-if="alerts.length === 0"
          :title="$t('dashboard.operational.todo.empty.title')"
          :description="$t('dashboard.operational.todo.empty.description')"
          variant="compact"
        />

        <!-- Checklist -->
        <div v-else class="space-y-2">
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            @click="handleAlertClick(alert)"
          >
            <!-- Checkbox Icon -->
            <div class="flex-shrink-0">
              <div
                :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  getIconBgClass(alert.type),
                ]"
              >
                <span class="text-sm">{{ alert.icon }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ alert.message }}</p>
            </div>

            <!-- Arrow -->
            <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { formatCurrency } from '@admin/lib/format'

export interface RecentOrder {
  id: string
  customerName: string
  total: number
  status: string
  createdAt: string
}

interface Alert {
  id: string
  type: 'low_stock' | 'pending_pack' | 'pending_payment' | 'seller_approval'
  message: string
  icon: string
  route: string
  query?: Record<string, string>
}

const props = withDefaults(
  defineProps<{
    orders?: RecentOrder[]
    isLoading?: boolean
    error?: Error | null
  }>(),
  {
    isLoading: false,
    error: null,
    orders: () => [],
  }
)

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()
const { t } = useI18n()

// Static alerts (same as DashboardAlertsCard)
const alerts = computed<Alert[]>(() => [
  {
    id: 'low_stock',
    type: 'low_stock',
    message: t('dashboard.alerts.lowStock.message'),
    icon: '⚠️',
    route: '/products',
    query: { lowStock: 'true' },
  },
  {
    id: 'pending_pack',
    type: 'pending_pack',
    message: t('dashboard.alerts.pendingPack.message'),
    icon: '📦',
    route: '/fulfillment',
    query: { status: 'to_pack' },
  },
  {
    id: 'pending_payment',
    type: 'pending_payment',
    message: t('dashboard.alerts.pendingPayment.message'),
    icon: '💳',
    route: '/orders',
    query: { payment_status: 'pending' },
  },
  {
    id: 'seller_approval',
    type: 'seller_approval',
    message: t('dashboard.alerts.sellerApproval.message'),
    icon: '🏪',
    route: '/sellers',
  },
])

function getIconBgClass(type: Alert['type']): string {
  const classes = {
    low_stock: 'bg-amber-100 text-amber-600',
    pending_pack: 'bg-blue-100 text-blue-600',
    pending_payment: 'bg-orange-100 text-orange-600',
    seller_approval: 'bg-purple-100 text-purple-600',
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

function getStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const variantMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  }
  return variantMap[status] || 'default'
}

function handleOrderClick(orderId: string): void {
  router.push({ name: 'orders', query: { id: orderId } })
}

function handleAlertClick(alert: Alert): void {
  router.push({
    path: alert.route,
    query: alert.query,
  })
}

function handleRetry(): void {
  emit('retry')
}
</script>
