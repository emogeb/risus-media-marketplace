<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden">
    <!-- Header -->
    <button
      type="button"
      @click="toggle"
      class="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      :aria-expanded="isOpen"
    >
      <div class="flex items-center gap-3">
        <!-- Icon -->
        <component
          :is="icon"
          class="h-5 w-5 text-gray-600"
          v-if="icon"
        />
        
        <!-- Title and Badge -->
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold text-gray-900">{{ title }}</h3>
          <span
            v-if="badge"
            class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
          >
            {{ badge }}
          </span>
        </div>
      </div>

      <!-- Expand/Collapse Icon -->
      <svg
        class="h-5 w-5 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Content -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-screen opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-screen opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isOpen" class="px-4 py-4 bg-white">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  defaultOpen?: boolean
  badge?: string | number
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
})

const isOpen = ref(props.defaultOpen)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>
