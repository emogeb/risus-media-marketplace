<template>
  <UiBadge v-if="badgeVariant" :variant="badgeVariant" class="text-xs">
    {{ badgeLabel }}
  </UiBadge>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import { isOverdue, isDueSoon } from '@admin/lib/date'

const props = defineProps<{
  dueDate: string | Date
}>()

const badgeVariant = computed(() => {
  if (isOverdue(props.dueDate)) {
    return 'danger'
  }
  if (isDueSoon(props.dueDate, 7)) {
    return 'warning'
  }
  return null
})

const badgeLabel = computed(() => {
  if (isOverdue(props.dueDate)) {
    return 'Gecikti'
  }
  if (isDueSoon(props.dueDate, 7)) {
    return 'Yaklaşıyor'
  }
  return ''
})
</script>
