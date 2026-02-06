<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
});

const isOpen = ref(props.defaultOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div class="border-b border-black/10 last:border-b-0">
    <button
      type="button"
      @click="toggle"
      class="flex w-full items-center justify-between py-4 text-left transition-colors hover:bg-black/[0.02]"
    >
      <span class="text-sm font-medium text-gray-900">{{ title }}</span>
      <svg
        class="h-5 w-5 text-gray-600 transition-transform"
        :class="{ 'rotate-45': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
    <div
      v-if="isOpen"
      class="pb-4 text-sm text-gray-700 leading-relaxed"
    >
      <slot />
    </div>
  </div>
</template>
