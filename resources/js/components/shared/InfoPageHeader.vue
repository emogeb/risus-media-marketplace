<script setup lang="ts">
interface Breadcrumb {
  label: string
  href?: string
}

interface Props {
  title: string
  breadcrumbs: Breadcrumb[]
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <!-- Breadcrumbs -->
    <nav class="mb-4" aria-label="Breadcrumb">
      <ol class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-2">
          <Link
            v-if="crumb.href"
            :href="crumb.href"
            class="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {{ crumb.label }}
          </Link>
          <span v-else class="text-gray-900 dark:text-gray-100">{{ crumb.label }}</span>
          <svg
            v-if="index < breadcrumbs.length - 1"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </li>
      </ol>
    </nav>

    <!-- Page Title -->
    <h1 class="text-4xl font-bold tracking-tight mb-2">
      {{ title }}
    </h1>

    <!-- Description -->
    <p v-if="description" class="text-lg text-gray-600 dark:text-gray-400">
      {{ description }}
    </p>
  </div>
</template>
