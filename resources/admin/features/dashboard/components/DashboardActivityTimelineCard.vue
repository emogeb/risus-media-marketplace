<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.activity.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.activity.subtitle') }}</p>
      </div>

      <!-- Empty State -->
      <UiEmptyState
        v-if="!items || items.length === 0"
        :title="$t('dashboard.activity.empty.title')"
        :description="$t('dashboard.activity.empty.description')"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
      </UiEmptyState>

      <!-- Timeline Items -->
      <div v-else class="space-y-4">
        <div
          v-for="(item, index) in items"
          :key="item.id || index"
          class="flex gap-4 relative"
        >
          <!-- Timeline Line -->
          <div
            v-if="index < items.length - 1"
            class="absolute left-6 top-12 w-0.5 h-full bg-gray-200"
          ></div>

          <!-- Icon -->
          <div class="flex-shrink-0 relative z-10">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm',
                getIconBgClass(item.type),
              ]"
            >
              <span class="text-lg">{{ getIcon(item.type) }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pb-4">
            <p class="text-sm font-medium text-gray-900">{{ item.message }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatTime(item.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '@admin/components/ui/UiCard.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import { formatRelativeTime } from '@admin/lib/date'

export interface ActivityItem {
  id?: string
  type: 'order' | 'product' | 'seller' | 'customer' | 'system'
  message: string
  timestamp: string | Date
}

const props = withDefaults(
  defineProps<{
    items?: ActivityItem[]
  }>(),
  {
    items: () => [],
  }
)

function getIcon(type: ActivityItem['type']): string {
  const icons = {
    order: '📦',
    product: '🛍️',
    seller: '🏪',
    customer: '👤',
    system: '⚙️',
  }
  return icons[type] || '📋'
}

function getIconBgClass(type: ActivityItem['type']): string {
  const classes = {
    order: 'bg-blue-100 text-blue-600',
    product: 'bg-purple-100 text-purple-600',
    seller: 'bg-green-100 text-green-600',
    customer: 'bg-orange-100 text-orange-600',
    system: 'bg-gray-100 text-gray-600',
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

function formatTime(timestamp: string | Date): string {
  return formatRelativeTime(timestamp)
}
</script>
