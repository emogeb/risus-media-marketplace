<template>
  <UiCard>
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-900">{{ $t('dashboard.cards.operationsQueue.title') }}</h3>
      <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.operationsQueue.subtitle') }}</p>
    </div>

    <div v-if="hasData" class="space-y-4">
      <!-- Measurements Section -->
      <div class="border border-gray-200 rounded-lg p-4 transition-colors duration-200 hover:border-amber-300/50 hover:bg-amber-50/30">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-amber-500"></div>
            <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.operationsQueue.measurements') }}</span>
          </div>
          <span class="text-lg font-semibold text-gray-900">{{ measurementsCount }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.operationsQueue.measurementsDesc') }}</p>
      </div>

      <!-- Alterations Section -->
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.operationsQueue.alterations') }}</span>
          </div>
          <span class="text-lg font-semibold text-gray-900">{{ alterationsCount }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.operationsQueue.alterationsDesc') }}</p>
      </div>

      <!-- Ready for Pickup Section -->
      <div class="border border-gray-200 rounded-lg p-4 transition-colors duration-200 hover:border-green-300/50 hover:bg-green-50/30">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-green-500"></div>
            <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.operationsQueue.ready') }}</span>
          </div>
          <span class="text-lg font-semibold text-gray-900">{{ readyCount }}</span>
        </div>
        <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.operationsQueue.readyDesc') }}</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-12">
      <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <h4 class="text-base font-semibold text-gray-900 mb-1.5">{{ $t('dashboard.cards.operationsQueue.empty.title') }}</h4>
      <p class="text-sm text-gray-500 text-center max-w-xs mb-4">
        {{ $t('dashboard.cards.operationsQueue.empty.description') }}
      </p>
      <UiButton size="sm" variant="ghost">{{ $t('dashboard.cards.operationsQueue.empty.action') }}</UiButton>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'

const props = defineProps<{
  measurementsCount?: number
  alterationsCount?: number
  readyCount?: number
}>()

const hasData = computed(() => {
  return (
    (props.measurementsCount && props.measurementsCount > 0) ||
    (props.alterationsCount && props.alterationsCount > 0) ||
    (props.readyCount && props.readyCount > 0)
  )
})

const measurementsCount = computed(() => props.measurementsCount || 0)
const alterationsCount = computed(() => props.alterationsCount || 0)
const readyCount = computed(() => props.readyCount || 0)
</script>
