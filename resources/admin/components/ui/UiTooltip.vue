<template>
  <div class="relative inline-flex items-center">
    <div
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @focus="showTooltip = true"
      @blur="showTooltip = false"
      class="inline-flex"
    >
      <slot />
    </div>

    <!-- Tooltip -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showTooltip"
        class="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg"
        :class="tooltipPositionClass"
        role="tooltip"
      >
        {{ text }}
        <!-- Arrow -->
        <div
          class="absolute w-2 h-2 bg-gray-900 transform rotate-45"
          :class="arrowPositionClass"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
})

const showTooltip = ref(false)

const tooltipPositionClass = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap'
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap'
    case 'left':
      return 'right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap'
    case 'right':
      return 'left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap'
    default:
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap'
  }
})

const arrowPositionClass = computed(() => {
  switch (props.position) {
    case 'top':
      return 'top-full left-1/2 -translate-x-1/2 -mt-1'
    case 'bottom':
      return 'bottom-full left-1/2 -translate-x-1/2 -mb-1'
    case 'left':
      return 'left-full top-1/2 -translate-y-1/2 -ml-1'
    case 'right':
      return 'right-full top-1/2 -translate-y-1/2 -mr-1'
    default:
      return 'top-full left-1/2 -translate-x-1/2 -mt-1'
  }
})
</script>
