<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <!-- Drawer -->
        <div
          :class="[
            'fixed top-0 bottom-0 bg-white shadow-2xl transition-transform duration-300 ease-out z-[60]',
            position === 'right' ? 'right-0' : 'left-0',
            width === 'sm' ? 'w-full sm:w-80' : width === 'md' ? 'w-full sm:w-96' : 'w-full sm:w-[28rem]',
          ]"
          @click.stop
        >
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div v-if="$slots.header" class="flex-shrink-0 border-b border-gray-200 p-4">
              <slot name="header" />
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-4">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="flex-shrink-0 border-t border-gray-200 p-4">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean
    position?: 'left' | 'right'
    width?: 'sm' | 'md' | 'lg'
  }>(),
  {
    position: 'right',
    width: 'md',
  }
)

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .fixed.right-0,
.drawer-leave-active .fixed.right-0,
.drawer-enter-active .fixed.left-0,
.drawer-leave-active .fixed.left-0 {
  transition: transform 0.3s ease;
}

.drawer-enter-from .fixed.right-0,
.drawer-leave-to .fixed.right-0 {
  transform: translateX(100%);
}

.drawer-enter-from .fixed.left-0,
.drawer-leave-to .fixed.left-0 {
  transform: translateX(-100%);
}
</style>
