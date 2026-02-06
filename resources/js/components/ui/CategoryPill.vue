<!-- resources/js/Components/UI/CategoryPill.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  active?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();

const classes = computed(() => 
  props.active
    ? 'bg-black text-white shadow-md'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
);
</script>

<template>
  <button
    :class="classes"
    class="whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>