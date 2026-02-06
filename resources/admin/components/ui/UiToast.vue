<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'rounded-lg shadow-lg p-4',
            variantClasses[toast.variant],
          ]"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="font-medium">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-1 text-sm opacity-90">{{ toast.message }}</p>
            </div>
            <button
              class="ml-4 text-current opacity-70 hover:opacity-100"
              @click="removeToast(toast.id)"
            >
              ×
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@admin/composables/useToast'

const { toasts, removeToast } = useToast()

const variantClasses = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-white',
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
