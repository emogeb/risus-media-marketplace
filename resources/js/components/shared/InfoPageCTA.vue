<script setup lang="ts">
interface Props {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  variant?: 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary'
})
</script>

<template>
  <div
    :class="[
      'mt-12 p-8 rounded-2xl text-center',
      variant === 'primary' 
        ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground' 
        : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
    ]"
  >
    <h3 class="text-2xl font-bold mb-3">{{ title }}</h3>
    <p
      :class="[
        'text-lg mb-6 max-w-2xl mx-auto',
        variant === 'primary' ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
      ]"
    >
      {{ description }}
    </p>
    <Link
      :href="buttonHref"
      :class="[
        'inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105',
        variant === 'primary'
          ? 'bg-primary-foreground text-primary hover:shadow-lg'
          : 'bg-primary text-primary-foreground hover:shadow-lg'
      ]"
    >
      {{ buttonText }}
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </Link>
  </div>
</template>
