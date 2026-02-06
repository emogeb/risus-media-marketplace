<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  modelValue?: string | number;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const value = useVModel(props, 'modelValue', emit);
</script>

<template>
  <div class="space-y-1">
    <div class="relative">
      <select
        v-model="value"
        :disabled="disabled"
        class="flex h-10 w-full appearance-none rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 pr-8"
        :class="[
          error ? 'border-destructive focus-visible:ring-destructive' : ''
        ]"
      >
        <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>
