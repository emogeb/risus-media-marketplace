<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  className?: string;
  noContainer?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  noContainer: false
});

const containerClass = computed(() => 
  props.noContainer ? '' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
);
</script>

<template>
  <section :class="['py-12 md:py-20 relative', props.className]">
    <div :class="containerClass">
      <slot />
    </div>
  </section>
</template>
