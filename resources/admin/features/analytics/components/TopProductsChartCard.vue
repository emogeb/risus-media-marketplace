<template>
  <UiCard>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
    <div v-if="isLoading" class="h-64 flex items-center justify-center">
      <UiSkeleton height="h-64" />
    </div>
    <div v-else-if="topProducts && topProducts.length > 0" class="space-y-3">
      <div
        v-for="product in topProducts"
        :key="product.name"
        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
      >
        <div>
          <p class="font-medium text-gray-900">{{ product.name }}</p>
          <p class="text-sm text-gray-600">{{ product.sales }} {{ $t('dashboard.cards.topProducts.salesUnit') }}</p>
        </div>
        <p class="font-medium text-gray-900">{{ formatCurrency(product.revenue) }}</p>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg
        class="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('dashboard.cards.topProducts.empty.title') }}</h4>
      <p class="text-sm text-gray-600 text-center max-w-sm">
        {{ $t('dashboard.cards.topProducts.empty.description') }}
      </p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import { useAnalyticsSummary } from '../composables/useAnalyticsSummary'
import { formatCurrency } from '@admin/lib/format'

const { data: analytics, isLoading } = useAnalyticsSummary()
const topProducts = computed(() => analytics.value?.topProducts)
</script>
