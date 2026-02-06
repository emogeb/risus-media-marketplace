<template>
  <UiCard>
    <div class="mb-6">
      <h3 class="text-base font-semibold text-gray-900">{{ $t('dashboard.cards.productionSnapshot.title') }}</h3>
      <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.cards.productionSnapshot.subtitle') }}</p>
    </div>

    <div class="space-y-4">
      <!-- Dikimde -->
      <div class="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
        <div class="flex items-center gap-3">
          <span class="text-xl opacity-70">🧵</span>
          <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.productionSnapshot.sewing') }}</span>
        </div>
        <span class="text-base font-semibold text-gray-900">—</span>
      </div>

      <!-- Prova Bekleyen -->
      <div class="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
        <div class="flex items-center gap-3">
          <span class="text-xl opacity-70">📐</span>
          <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.productionSnapshot.fittingPending') }}</span>
        </div>
        <span class="text-base font-semibold text-gray-900">—</span>
      </div>

      <!-- Teslime Hazır -->
      <div class="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
        <div class="flex items-center gap-3">
          <span class="text-xl opacity-70">📦</span>
          <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.productionSnapshot.readyForDelivery') }}</span>
        </div>
        <span class="text-base font-semibold text-gray-900">—</span>
      </div>

      <!-- Geciken İşler -->
      <div class="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
        <div class="flex items-center gap-3">
          <span class="text-xl opacity-70">⏳</span>
          <span class="text-sm font-medium text-gray-700">{{ $t('dashboard.cards.productionSnapshot.delayed') }}</span>
        </div>
        <span class="text-base font-semibold text-gray-900">—</span>
      </div>
    </div>

    <!-- Footer Note -->
    <div class="mt-6 pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-400 text-center">{{ $t('dashboard.cards.productionSnapshot.footerNote') }}</p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '@admin/components/ui/UiCard.vue'
</script>
