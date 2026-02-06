<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  centered: false,
  dark: false
});
</script>

<template>
  <div :class="['mb-12', centered ? 'text-center' : '']">
    <h2 
      class="text-3xl font-bold tracking-tight md:text-4xl"
      :class="dark ? 'text-white' : 'text-foreground'"
    >
      {{ title }}
    </h2>
    <p 
      v-if="subtitle" 
      class="mt-4 text-lg max-w-2xl"
      :class="[
        dark ? 'text-white/80' : 'text-muted-foreground',
        centered ? 'mx-auto' : ''
      ]"
    >
      {{ subtitle }}
    </p>
    <div 
      v-if="$slots.action" 
      class="mt-6"
    >
      <slot name="action" />
    </div>
  </div>
</template>
