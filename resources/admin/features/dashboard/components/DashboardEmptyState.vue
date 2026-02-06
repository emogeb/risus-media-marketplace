<template>
  <div class="flex flex-col items-center justify-center text-center py-12">
    <!-- Icon -->
    <div v-if="hasIcon" :class="iconContainerClass">
      <slot name="icon">
        <svg
          class="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <h4 v-if="title" class="text-base font-semibold text-gray-900 mb-2">{{ title }}</h4>

    <!-- Description -->
    <p v-if="description" class="text-sm text-gray-600 max-w-md mb-6">{{ description }}</p>

    <!-- Actions Slot -->
    <div v-if="$slots.actions" class="flex flex-wrap items-center justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    icon?: boolean
  }>(),
  {
    icon: true,
  }
)

const hasIcon = computed(() => props.icon || !!slots.icon)

const iconContainerClass = computed(() => {
  return 'w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4'
})
</script>
