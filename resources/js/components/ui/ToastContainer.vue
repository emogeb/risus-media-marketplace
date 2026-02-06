<script setup lang="ts">
import { useToastStore } from '@/stores/toast';

const store = useToastStore();
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in store.toasts"
        :key="toast.id"
        class="flex min-w-[300px] items-center gap-3 rounded-lg border px-4 py-3 shadow-lg"
        :class="{
          'border-green-200 bg-white text-green-800': toast.type === 'success',
          'border-red-200 bg-white text-red-800': toast.type === 'error',
          'border-blue-200 bg-white text-blue-800': toast.type === 'info',
        }"
      >
        <!-- Icons -->
        <span v-if="toast.type === 'success'" class="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
          <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span v-else-if="toast.type === 'error'" class="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <svg class="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        
        <p class="text-sm font-medium">{{ toast.message }}</p>
        
        <button @click="store.remove(toast.id)" class="ml-auto text-gray-400 hover:text-gray-600">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
