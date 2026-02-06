<template>
  <UiBadge :variant="variant">
    {{ statusLabels[status] }}
  </UiBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import type { OrderStatus } from '../types'

const props = defineProps<{
  status: OrderStatus
}>()

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Beklemede',
  confirmed: 'Onaylandı',
  processing: 'İşleniyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal',
}

const variant = computed(() => {
  const variantMap: Record<OrderStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  }
  return variantMap[props.status] || 'default'
})
</script>
