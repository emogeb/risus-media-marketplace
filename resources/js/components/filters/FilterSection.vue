<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  title: string;
  defaultOpen?: boolean;
  countLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true,
});

const open = ref(props.defaultOpen);
const toggle = () => (open.value = !open.value);

const chevronClass = computed(() =>
  open.value ? 'rotate-180' : 'rotate-0'
);
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      @click="toggle"
    >
      <div class="min-w-0">
        <p class="text-sm font-semibold text-gray-900">{{ title }}</p>
        <p v-if="countLabel" class="mt-0.5 text-xs text-gray-500">{{ countLabel }}</p>
      </div>
      <svg
        class="h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200"
        :class="chevronClass"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div v-show="open" class="px-4 pb-4">
      <slot />
    </div>
  </section>
</template>

