<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.activity.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.activity.subtitle') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-3">
        <UiSkeleton v-for="i in 5" :key="i" width="w-full" height="h-16" />
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
        v-else-if="isEmpty"
        :title="$t('dashboard.empty.activity.title')"
        :description="$t('dashboard.empty.activity.description')"
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </template>
        <template #actions>
          <router-link :to="{ name: 'orders' }">
            <UiButton size="sm" variant="primary">{{ $t('dashboard.empty.activity.cta') }}</UiButton>
          </router-link>
        </template>
      </DashboardEmptyState>

      <!-- Timeline Items -->
      <div v-else class="space-y-4">
        <div
          v-for="(item, index) in props.items"
          :key="item.id"
          class="flex gap-4 relative group"
        >
          <!-- Timeline Line -->
          <div
            v-if="index < props.items.length - 1"
            class="absolute left-6 top-14 w-0.5 h-full bg-gray-200"
          ></div>

          <!-- Icon -->
          <div class="flex-shrink-0 relative z-10">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform group-hover:scale-105',
                getIconBgClass(item.type),
              ]"
            >
              <span class="text-lg">{{ getIcon(item.type) }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pb-4">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-900">{{ item.title }}</h4>
                <p v-if="item.description" class="text-xs text-gray-500 mt-1">{{ item.description }}</p>
                <p v-if="item.at" class="text-xs text-gray-400 mt-1.5">{{ formatTime(item.at) }}</p>
              </div>
              <router-link
                v-if="item.href"
                :to="item.href"
                class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  class="w-4 h-4 text-gray-400 hover:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import DashboardEmptyState from './DashboardEmptyState.vue'
import { formatRelativeTime } from '@admin/lib/date'
import type { ActivityItem } from '../composables/useDashboardOverview'

const props = withDefaults(
  defineProps<{
    items?: ActivityItem[]
    isLoading?: boolean
    error?: boolean
  }>(),
  {
    items: () => [],
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

const isEmpty = computed(() => !props.items || props.items.length === 0)

function getIcon(type: ActivityItem['type']): string {
  const icons = {
    order: '📦',
    product: '🛍️',
    seller: '🏪',
    customer: '👤',
  }
  return icons[type] || '📋'
}

function getIconBgClass(type: ActivityItem['type']): string {
  const classes = {
    order: 'bg-blue-100 text-blue-600',
    product: 'bg-purple-100 text-purple-600',
    seller: 'bg-green-100 text-green-600',
    customer: 'bg-orange-100 text-orange-600',
  }
  return classes[type] || 'bg-gray-100 text-gray-600'
}

function formatTime(timestamp: string): string {
  return formatRelativeTime(timestamp)
}
</script>
