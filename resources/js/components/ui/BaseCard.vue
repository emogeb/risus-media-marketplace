<script setup lang="ts">
interface Props {
  href?: string;
  className?: string;
  hoverScale?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  href: undefined,
  className: '',
  hoverScale: true
});
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :class="[
      'group relative block overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-all duration-300',
      hoverScale ? 'hover:-translate-y-1 hover:shadow-lg hover:border-primary/20' : '',
      props.className
    ]"
  >
    <slot />
  </component>
</template>
