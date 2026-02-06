<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.widgets.alerts.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.widgets.alerts.description') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-3">
        <UiSkeleton width="w-full" height="h-12" />
        <UiSkeleton width="w-full" height="h-12" />
        <UiSkeleton width="w-full" height="h-12" />
        <UiSkeleton width="w-full" height="h-12" />
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
        v-else-if="empty"
        :title="$t('dashboard.empty.alerts.title')"
        :description="$t('dashboard.empty.alerts.description')"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </UiEmptyState>

      <!-- Alerts List -->
      <div v-else-if="!empty" class="space-y-3">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          @click="handleAlertClick(alert)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                getIconBgClass(alert.type),
              ]"
            >
              <span class="text-lg">{{ alert.icon }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ alert.message }}</p>
          </div>

          <!-- Action Button -->
          <div class="flex-shrink-0">
            <UiButton size="sm" variant="ghost" class="text-xs" @click.stop="handleAlertClick(alert)">
              {{ $t('dashboard.alerts.actionButton') }}
              <svg
                class="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </UiButton>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'

interface Alert {
  id: string
  type: 'low_stock' | 'pending_pack' | 'pending_payment' | 'seller_approval'
  message: string
  icon: string
  route: string
  query?: Record<string, string>
}

// Props
const props = withDefaults(
  defineProps<{
    isLoading?: boolean
    error?: boolean
    empty?: boolean
  }>(),
  {
    isLoading: false,
    error: false,
    empty: true,
  }
)

const router = useRouter()
const { t } = useI18n()

const emit = defineEmits<{
  retry: []
}>()

function handleRetry(): void {
  emit('retry')
}

// Static alerts (hardcoded, no counts)
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

function handleAlertClick(alert: Alert): void {
  router.push({
    path: alert.route,
    query: alert.query,
  })
}
</script>
