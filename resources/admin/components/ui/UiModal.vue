```html
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        <!-- Modal Container -->
        <div class="flex min-h-screen items-center justify-center p-4 z-[60]">
          <div
            class="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
            @click.stop
          >
            <div class="p-6">
              <div v-if="$slots.header" class="mb-4">
                <slot name="header" />
              </div>
              <slot />
              <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
