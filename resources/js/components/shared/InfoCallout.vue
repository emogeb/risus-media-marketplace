<script setup lang="ts">
interface Props {
  type?: 'info' | 'warning' | 'success' | 'error'
  title?: string
}

withDefaults(defineProps<Props>(), {
  type: 'info'
})
</script>

<template>
  <div
    :class="[
      'rounded-lg border-l-4 p-4 mb-6',
      {
        'bg-blue-50 dark:bg-blue-950/20 border-blue-500': type === 'info',
        'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500': type === 'warning',
        'bg-green-50 dark:bg-green-950/20 border-green-500': type === 'success',
        'bg-red-50 dark:bg-red-950/20 border-red-500': type === 'error',
      }
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Icon -->
      <div
        :class="[
          'w-5 h-5 flex-shrink-0 mt-0.5',
          {
            'text-blue-600 dark:text-blue-400': type === 'info',
            'text-yellow-600 dark:text-yellow-400': type === 'warning',
            'text-green-600 dark:text-green-400': type === 'success',
            'text-red-600 dark:text-red-400': type === 'error',
          }
        ]"
      >
        <svg v-if="type === 'info'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="type === 'warning'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <svg v-else-if="type === 'success'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h5
          v-if="title"
          class="font-semibold mb-1"
          :class="{
            'text-blue-900 dark:text-blue-100': type === 'info',
            'text-yellow-900 dark:text-yellow-100': type === 'warning',
            'text-green-900 dark:text-green-100': type === 'success',
            'text-red-900 dark:text-red-100': type === 'error',
          }"
        >
          {{ title }}
        </h5>
        <div
          class="text-sm"
          :class="{
            'text-blue-800 dark:text-blue-200': type === 'info',
            'text-yellow-800 dark:text-yellow-200': type === 'warning',
            'text-green-800 dark:text-green-200': type === 'success',
            'text-red-800 dark:text-red-200': type === 'error',
          }"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
