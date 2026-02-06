<template>
  <UiCard class="border-gray-200/60">
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.snapshot.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.snapshot.description') }}</p>
      </div>

      <!-- Content -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Today Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">📅</span>
            <h4 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.snapshot.columns.today.title') }}</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.today.orders') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-600">{{ $t('dashboard.snapshot.columns.today.revenue') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.today.returns') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
          </div>
        </div>

        <!-- Operations Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">⚙️</span>
            <h4 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.snapshot.columns.operations.title') }}</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.operations.toPack') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.operations.inTransit') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.operations.delivered') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
          </div>
        </div>

        <!-- Customer Column -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="text-lg">👥</span>
            <h4 class="text-sm font-semibold text-gray-700">{{ $t('dashboard.snapshot.columns.customer.title') }}</h4>
          </div>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.customer.newRegistration') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.customer.newCompany') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ $t('dashboard.snapshot.columns.customer.newSeller') }}</span>
              <span class="text-sm font-medium text-gray-900">—</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '@admin/components/ui/UiCard.vue'
</script>
