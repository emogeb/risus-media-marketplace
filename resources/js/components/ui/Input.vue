<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps<{
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}>();

const value = useVModel(props, 'modelValue', emit);
</script>

<template>
  <div class="space-y-1">
    <input
      v-model="value"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
      class="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
      :class="[
        error ? 'border-destructive focus-visible:ring-destructive' : ''
      ]"
    />
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>
