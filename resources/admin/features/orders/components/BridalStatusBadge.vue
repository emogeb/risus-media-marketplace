<template>
  <UiBadge :variant="variant">
    {{ label }}
  </UiBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import type { BridalStatus } from '../types'

const props = defineProps<{
  status: BridalStatus
}>()

const label = computed(() => {
  const labels: Record<BridalStatus, string> = {
    new: 'Yeni',
    measurement_pending: 'Ölçü Bekleniyor',
    measurement_done: 'Ölçü Alındı',
    fitting_1_scheduled: '1. Prova Planlandı',
    fitting_1_done: '1. Prova Tamamlandı',
    alteration_in_progress: 'Tadilat Sürüyor',
    fitting_2_scheduled: '2. Prova Planlandı',
    ready_for_pickup: 'Teslime Hazır',
    shipped: 'Kargoda',
    completed: 'Tamamlandı',
    cancelled: 'İptal',
  }
  return labels[props.status] || props.status
})

const variant = computed(() => {
  const variantMap: Record<BridalStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    new: 'info',
    measurement_pending: 'warning',
    measurement_done: 'info',
    fitting_1_scheduled: 'info',
    fitting_1_done: 'info',
    alteration_in_progress: 'warning',
    fitting_2_scheduled: 'info',
    ready_for_pickup: 'success',
    shipped: 'info',
    completed: 'success',
    cancelled: 'danger',
  }
  return variantMap[props.status] || 'default'
})
</script>
