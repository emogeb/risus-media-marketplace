<template>
  <div :class="['flex flex-col items-center justify-center text-center', paddingClass]">
    <!-- Icon -->
    <div v-if="hasIcon" :class="iconContainerClass">
      <slot name="icon">
        <svg
          class="w-8 h-8 text-gray-400"
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
    <h4 v-if="title" :class="titleClass">{{ title }}</h4>

    <!-- Description -->
    <p v-if="description" :class="descriptionClass">{{ description }}</p>

    <!-- Action Button -->
    <div v-if="actionLabel && actionTo" class="mt-6">
      <router-link :to="actionTo">
        <UiButton :disabled="actionDisabled" variant="secondary" size="sm">
          {{ actionLabel }}
        </UiButton>
      </router-link>
    </div>
    
    <!-- Custom Actions Slot -->
    <div v-if="$slots.actions" class="mt-6 flex flex-wrap items-center justify-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import UiButton from './UiButton.vue'

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    icon?: boolean
    actionLabel?: string
    actionTo?: RouteLocationRaw
    actionDisabled?: boolean
    variant?: 'default' | 'compact'
  }>(),
  {
    icon: true,
    variant: 'default',
    actionDisabled: false,
  }
)

const hasIcon = computed(() => props.icon || !!slots.icon)

const paddingClass = computed(() => {
  return props.variant === 'compact' ? 'py-8' : 'py-12'
})

const iconContainerClass = computed(() => {
  const base = 'rounded-full flex items-center justify-center mb-4'
  if (props.variant === 'compact') {
    return `${base} w-12 h-12 bg-gray-100`
  }
  return `${base} w-16 h-16 bg-gray-100`
})

const titleClass = computed(() => {
  const base = 'font-semibold text-gray-900'
  if (props.variant === 'compact') {
    return `${base} text-sm mb-1`
  }
  return `${base} text-base mb-2`
})

const descriptionClass = computed(() => {
  const base = 'text-sm text-gray-600'
  if (props.variant === 'compact') {
    return `${base} text-xs max-w-sm`
  }
  return `${base} max-w-md`
})
</script>
