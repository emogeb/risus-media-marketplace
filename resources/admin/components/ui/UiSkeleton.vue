<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 rounded',
      width,
      height,
    ]"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
  }>(),
  {
    width: 'w-full',
    height: 'h-4',
  }
)
</script>
