<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-sm border border-gray-200/60 transition-all duration-200 hover:shadow hover:border-gray-300/80',
      paddingClass,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    padding: 'md',
  }
)

const paddingClass = computed(() => {
  const classes: Record<typeof props.padding, string> = {
    none: '',
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8',
  }
  return classes[props.padding]
})
</script>
