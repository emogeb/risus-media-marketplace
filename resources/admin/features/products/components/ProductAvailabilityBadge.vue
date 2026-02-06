<template>
  <UiBadge :variant="variant">
    {{ label }}
  </UiBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import type { ProductAvailability } from '../types'

const props = defineProps<{
  availability: ProductAvailability
}>()

const label = computed(() => {
  const labels: Record<ProductAvailability, string> = {
    in_stock: 'Stokta',
    made_to_order: 'Sipariş Üzerine',
    preorder: 'Ön Sipariş',
  }
  return labels[props.availability] || props.availability
})

const variant = computed(() => {
  const variantMap: Record<ProductAvailability, 'success' | 'warning' | 'info' | 'default'> = {
    in_stock: 'success',
    made_to_order: 'info',
    preorder: 'warning',
  }
  return variantMap[props.availability] || 'default'
})
</script>
