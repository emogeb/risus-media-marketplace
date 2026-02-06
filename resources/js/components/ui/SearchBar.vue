<!-- Components/Store/SearchBar.vue -->
<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'search': [value: string];
}>();

const isFocused = ref(false);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const clearSearch = () => {
  emit('update:modelValue', '');
};
</script>

<template>
  <div class="relative w-full max-w-md">
    <div 
      class="relative transition-all duration-200"
      :class="isFocused ? 'scale-105' : 'scale-100'"
    >
      <!-- Search Icon -->
      <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          class="w-5 h-5 transition-colors duration-200"
          :class="isFocused ? 'text-blue-600' : 'text-gray-400'"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>

      <!-- Input -->
      <input
        :value="modelValue"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
        type="text"
        :placeholder="placeholder || 'Ara...'"
        @keydown.enter="$emit('search', modelValue)"
        class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />

      <!-- Clear Button -->
      <button
        v-if="modelValue"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Search Suggestions (Optional) -->
    <div 
      v-if="isFocused && modelValue"
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div class="p-2">
        <p class="text-xs text-gray-500 px-3 py-2">Arama sonuçları...</p>
      </div>
    </div>
  </div>
</template>