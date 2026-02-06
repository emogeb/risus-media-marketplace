<script setup lang="ts">
interface Props {
  id?: string
  title?: string
  level?: 2 | 3 | 4
}

const props = withDefaults(defineProps<Props>(), {
  level: 2
})

const Component = `h${props.level}` as 'h2' | 'h3' | 'h4'
</script>

<template>
  <section :id="id" class="mb-8 scroll-mt-24">
    <component
      :is="Component"
      v-if="title"
      class="font-bold mb-4"
      :class="{
        'text-3xl': level === 2,
        'text-2xl': level === 3,
        'text-xl': level === 4,
      }"
    >
      {{ title }}
    </component>
    <div class="space-y-4 text-gray-800 dark:text-gray-200 leading-relaxed">
      <slot />
    </div>
  </section>
</template>
