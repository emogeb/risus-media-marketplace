<template>
  <UiCard>
    <div v-if="isLoading" class="space-y-4">
      <UiSkeleton height="h-8" />
      <UiSkeleton height="h-4" />
      <UiSkeleton height="h-4" />
    </div>
    <div v-else-if="seller" class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ seller.name }}</h2>
          <p v-if="seller.companyName" class="text-sm text-gray-600 mt-1">{{ seller.companyName }}</p>
        </div>
        <UiBadge v-if="seller.status" :variant="getStatusVariant(seller.status)">
          {{ getStatusLabel(seller.status) }}
        </UiBadge>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div v-if="seller.email">
          <p class="text-xs text-gray-500 mb-1">Email</p>
          <p class="text-sm text-gray-900">{{ seller.email }}</p>
        </div>
        <div v-if="seller.phone">
          <p class="text-xs text-gray-500 mb-1">Telefon</p>
          <p class="text-sm text-gray-900">{{ seller.phone }}</p>
        </div>
        <div v-if="seller.city">
          <p class="text-xs text-gray-500 mb-1">Şehir</p>
          <p class="text-sm text-gray-900">{{ seller.city }}</p>
        </div>
        <div v-if="seller.taxNumber">
          <p class="text-xs text-gray-500 mb-1">Vergi No</p>
          <p class="text-sm text-gray-900">{{ seller.taxNumber }}</p>
        </div>
        <div v-if="seller.totalProducts !== undefined">
          <p class="text-xs text-gray-500 mb-1">Toplam Ürün</p>
          <p class="text-sm text-gray-900">{{ seller.totalProducts }}</p>
        </div>
        <div v-if="seller.totalSales !== undefined">
          <p class="text-xs text-gray-500 mb-1">Toplam Satış</p>
          <p class="text-sm text-gray-900">{{ formatCurrency(seller.totalSales) }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-8 text-gray-500">
      <p class="text-sm">Satıcı bilgisi yüklenemedi</p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import { formatCurrency } from '@admin/lib/format'
import type { Seller } from '../types'

defineProps<{
  seller?: Seller
  isLoading: boolean
}>()

function getStatusVariant(status: Seller['status']): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  if (!status) return 'default'
  const variants = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
  }
  return (variants[status] || 'default') as 'success' | 'warning' | 'danger' | 'info' | 'default'
}

function getStatusLabel(status: Seller['status']): string {
  if (!status) return '—'
  const labels = {
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Beklemede',
  }
  return labels[status] || status
}
</script>
