<template>
  <UiBadge v-if="isLowStock" variant="warning">
    Düşük Stok
  </UiBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'

const props = withDefaults(defineProps<{
  stock: number
  threshold?: number
}>(), {
  threshold: 5
})

const isLowStock = computed(() => props.stock <= props.threshold)
</script>
