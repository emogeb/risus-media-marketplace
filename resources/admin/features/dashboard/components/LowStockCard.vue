<template>
  <UiCard>
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-900">{{ $t('dashboard.cards.lowStock.title') }}</h3>
      <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.lowStock.subtitle') }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 3" :key="i" height="h-16" />
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

    <!-- Content -->
    <div v-else-if="props.lowStockProducts && props.lowStockProducts.length > 0" class="space-y-3">
      <div
        v-for="product in props.lowStockProducts.slice(0, 5)"
        :key="product.id"
        class="flex items-center justify-between p-3 border border-amber-200 bg-amber-50 rounded-lg transition-colors duration-200 hover:bg-amber-100/50"
      >
        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ product.name }}</p>
          <p class="text-sm text-gray-600 mt-0.5">{{ product.sku || $t('dashboard.cards.lowStock.noSku') }}</p>
        </div>
        <div class="text-right ml-4">
          <p class="text-sm font-semibold text-amber-700">{{ product.stock }} {{ $t('dashboard.cards.lowStock.unit') }}</p>
          <UiBadge variant="warning" class="mt-1">{{ $t('dashboard.cards.lowStock.badge') }}</UiBadge>
        </div>
      </div>
      <div v-if="props.lowStockProducts.length > 5" class="pt-2">
        <router-link to="/products">
          <UiButton size="sm" variant="ghost" class="w-full">
            {{ $t('dashboard.cards.lowStock.viewAll') }} ({{ props.lowStockProducts.length }})
          </UiButton>
        </router-link>
      </div>
    </div>

    <UiEmptyState
      v-else
      :title="$t('dashboard.cards.lowStock.empty.title')"
      :description="$t('dashboard.cards.lowStock.empty.description')"
      variant="compact"
    >
      <template #icon>
        <svg
          class="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </template>
    </UiEmptyState>
  </UiCard>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import type { Product } from '@admin/features/products/types'

const props = withDefaults(
  defineProps<{
    lowStockProducts?: Product[]
    isLoading?: boolean
    error?: boolean
  }>(),
  {
    lowStockProducts: () => [],
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
</script>
