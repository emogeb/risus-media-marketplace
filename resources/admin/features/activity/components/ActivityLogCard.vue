<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.widgets.activityLog.title') }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          {{ $t('dashboard.widgets.activityLog.subtitle') }}
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-3">
        <UiSkeleton width="w-full" height="h-12" />
        <UiSkeleton width="w-full" height="h-12" />
        <UiSkeleton width="w-full" height="h-12" />
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="py-8">
        <div class="flex flex-col items-center justify-center text-center">
          <svg
            class="w-12 h-12 text-amber-500 mb-4"
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
          <h4 class="text-sm font-medium text-gray-900 mb-1">
            {{ $t('dashboard.widgets.activityLog.error.title') }}
          </h4>
          <p class="text-xs text-gray-500">
            {{ $t('dashboard.widgets.activityLog.error.description') }}
          </p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="logs.length === 0" class="py-8">
        <div class="flex flex-col items-center justify-center text-center">
          <svg
            class="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h4 class="text-sm font-medium text-gray-900 mb-1">
            {{ $t('dashboard.widgets.activityLog.empty.title') }}
          </h4>
          <p class="text-xs text-gray-500">
            {{ $t('dashboard.widgets.activityLog.empty.description') }}
          </p>
        </div>
      </div>

      <!-- Activity List -->
      <div v-else class="space-y-3">
        <div
          v-for="log in logs"
          :key="log.id"
          class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          @click="handleLogClick(log)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center',
                getActionIconBgClass(log.action),
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="getActionIcon(log.action)"
                />
              </svg>
            </div>
          </div>

          <!-- Description -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">
              {{ getActionDescription(log) }}
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ log.actorName }} • {{ log.actorRole }}
            </p>
          </div>

          <!-- Time -->
          <div class="flex-shrink-0">
            <span class="text-xs text-gray-400">{{ formatRelativeTime(log.createdAt) }}</span>
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
import { useActivityLog } from '../composables/useActivityLog'
import { formatRelativeTime } from '@admin/lib/date'
import type { ActivityLog, ActivityAction } from '../types'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'

const props = withDefaults(
  defineProps<{
    limit?: number
  }>(),
  {
    limit: 10,
  }
)

const router = useRouter()
const { t } = useI18n()

const { logs, isLoading, isError } = useActivityLog(props.limit)

function getActionIcon(action: ActivityAction) {
  // Return SVG path based on action type
  const iconPaths: Record<string, string> = {
    'order.update':
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'order.create': 'M12 4v16m8-8H4',
    'order.delete':
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'product.update':
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'product.create': 'M12 4v16m8-8H4',
    'product.delete':
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'seller.create': 'M12 4v16m8-8H4',
    'seller.update':
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'seller.delete':
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'settings.update':
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'view.save': 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
    'view.delete':
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    'customer.create': 'M12 4v16m8-8H4',
    'customer.update':
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  }

  return iconPaths[action] || iconPaths['order.update']
}

function getActionIconBgClass(action: ActivityAction): string {
  if (action.includes('order')) {
    return 'bg-blue-100 text-blue-600'
  } else if (action.includes('product')) {
    return 'bg-green-100 text-green-600'
  } else if (action.includes('seller')) {
    return 'bg-purple-100 text-purple-600'
  } else if (action.includes('settings')) {
    return 'bg-gray-100 text-gray-600'
  } else if (action.includes('view')) {
    return 'bg-amber-100 text-amber-600'
  } else if (action.includes('customer')) {
    return 'bg-indigo-100 text-indigo-600'
  }
  return 'bg-gray-100 text-gray-600'
}

function getActionDescription(log: ActivityLog): string {
  return t(`activity.actions.${log.action}`, {
    entityId: log.entityId || '',
  })
}

function handleLogClick(log: ActivityLog): void {
  if (!log.entityId) return

  const routes: Record<string, string> = {
    order: '/orders',
    product: '/products',
    seller: '/sellers',
    customer: '/customers',
  }

  const route = routes[log.entityType]
  if (route) {
    router.push({
      path: route,
      query: log.entityId ? { id: log.entityId } : {},
    })
  }
}
</script>
