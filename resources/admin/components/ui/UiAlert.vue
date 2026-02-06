<template>
  <div
    :class="[
      'rounded-lg border p-4',
      variantClasses,
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div v-if="icon" :class="iconClasses">
        <slot name="icon">
          <svg
            v-if="variant === 'error'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="variant === 'warning'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <svg
            v-else-if="variant === 'success'"
            class="w-5 h-5"
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
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </slot>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h4 v-if="title" :class="titleClasses">{{ title }}</h4>
        <p v-if="message || $slots.default" :class="messageClasses">
          <slot>{{ message }}</slot>
        </p>
      </div>

      <!-- Close button -->
      <button
        v-if="dismissible"
        :class="closeButtonClasses"
        @click="$emit('dismiss')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'error' | 'warning' | 'success' | 'info'
    title?: string
    message?: string
    icon?: boolean
    dismissible?: boolean
  }>(),
  {
    variant: 'info',
    icon: true,
    dismissible: false,
  }
)

defineEmits<{
  dismiss: []
}>()

const variantClasses = computed(() => {
  const base = 'border'
  switch (props.variant) {
    case 'error':
      return `${base} border-red-200 bg-red-50 text-red-800`
    case 'warning':
      return `${base} border-yellow-200 bg-yellow-50 text-yellow-800`
    case 'success':
      return `${base} border-green-200 bg-green-50 text-green-800`
    default:
      return `${base} border-blue-200 bg-blue-50 text-blue-800`
  }
})

const iconClasses = computed(() => {
  const base = 'flex-shrink-0'
  switch (props.variant) {
    case 'error':
      return `${base} text-red-500`
    case 'warning':
      return `${base} text-yellow-500`
    case 'success':
      return `${base} text-green-500`
    default:
      return `${base} text-blue-500`
  }
})

const titleClasses = computed(() => {
  const base = 'text-sm font-semibold mb-1'
  return base
})

const messageClasses = computed(() => {
  const base = 'text-sm'
  return base
})

const closeButtonClasses = computed(() => {
  const base = 'flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors'
  return base
})
</script>
