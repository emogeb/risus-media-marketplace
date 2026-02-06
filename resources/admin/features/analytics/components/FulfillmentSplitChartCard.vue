<template>
  <UiCard>
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-900">Sevkiyat Dağılımı</h3>
      <p class="text-xs text-gray-500 mt-1">Fulfillment breakdown</p>
    </div>
    <div v-if="isLoading" class="h-64 flex items-center justify-center">
      <UiSkeleton height="h-64" />
    </div>
    <div v-else-if="split" class="space-y-4">
      <div>
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.fulfillmentSplit.shipping') }}</span>
          <span class="text-sm font-medium text-gray-900">{{ split.shipping }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full"
            :style="{ width: `${split.shipping}%` }"
          />
        </div>
      </div>
      <div>
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Mağazadan Al</span>
          <span class="text-sm font-medium text-gray-900">{{ split.pickup }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-green-600 h-2 rounded-full"
            :style="{ width: `${split.pickup}%` }"
          />
        </div>
      </div>
    </div>
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h4 class="text-base font-semibold text-gray-900 mb-1.5">{{ $t('dashboard.cards.fulfillmentSplit.empty.title') }}</h4>
      <p class="text-sm text-gray-500 text-center max-w-xs">
        {{ $t('dashboard.cards.fulfillmentSplit.empty.description') }}
      </p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import { useAnalyticsSummary } from '../composables/useAnalyticsSummary'

const { data: analytics, isLoading } = useAnalyticsSummary()
const split = computed(() => analytics.value?.fulfillmentSplit)
</script>
