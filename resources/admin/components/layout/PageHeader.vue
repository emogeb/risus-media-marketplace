<template>
  <div class="mb-8 flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 tracking-tight">{{ title }}</h1>
      <p v-if="description" class="mt-2 text-sm text-gray-500">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex-shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
