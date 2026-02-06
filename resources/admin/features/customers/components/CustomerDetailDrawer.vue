<template>
  <UiModal :model-value="isOpen" @update:model-value="$emit('close')">
    <template #header>
      <h2 class="text-xl font-bold">Müşteri Detayı</h2>
    </template>
    <div v-if="customer" class="space-y-4">
      <div>
        <p class="text-sm text-gray-600">Ad Soyad</p>
        <p class="font-medium">{{ customer.name }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Email</p>
        <p class="font-medium">{{ customer.email }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Telefon</p>
        <p class="font-medium">{{ customer.phone }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Toplam Sipariş</p>
        <p class="font-medium">{{ customer.totalOrders }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Toplam Harcama</p>
        <p class="font-medium text-lg">{{ formatCurrency(customer.totalSpent) }}</p>
      </div>
      <div>
        <p class="text-sm text-gray-600">Son Sipariş</p>
        <p class="font-medium">{{ formatDate(customer.lastOrderDate) }}</p>
      </div>
    </div>
    <template #footer>
      <UiButton variant="ghost" @click="$emit('close')">Kapat</UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import UiModal from '@admin/components/ui/UiModal.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { formatCurrency, formatDate } from '@admin/lib/format'
import type { Customer } from '../types'

defineProps<{
  isOpen: boolean
  customer?: Customer
}>()

defineEmits<{
  close: []
}>()
</script>
