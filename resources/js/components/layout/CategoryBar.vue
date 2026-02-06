<!-- resources/js/components/layout/CategoryBar.vue -->
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { route as ziggyRoute } from 'ziggy-js';
import CategoryPill from '@/components/ui/CategoryPill.vue';

// Use Ziggy route helper with error handling
const route = (name: string, params?: any) => {
  try {
    return ziggyRoute(name, params);
  } catch (e) {
    console.warn(`Route "${name}" not found`, e);
    return '#';
  }
};

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  products_count?: number;
}

const props = defineProps<{
  categories: Category[];
  activeSlug?: string;
}>();

const handleCategoryClick = (slug: string) => {
  if (slug === 'all') {
    router.get(route('home'), {}, { 
      preserveState: true, 
      preserveScroll: true 
    });
  } else {
    router.get(route('home.category', { categorySlug: slug }), {}, { 
      preserveState: true, 
      preserveScroll: true 
    });
  }
};

// Calculate total products count
const totalProductsCount = props.categories.reduce((sum, cat) => sum + (cat.products_count || 0), 0);
</script>

<template>
  <div class="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
    <div class="mx-auto max-w-6xl px-6 py-4">
      <!-- Breadcrumb -->
      <div class="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <a :href="route('home')" class="hover:text-gray-900 transition-colors">Home</a>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span v-if="activeSlug && activeSlug !== 'all'" class="font-medium text-gray-900">
          {{ categories.find(c => c.slug === activeSlug)?.name || 'Collections' }}
        </span>
        <span v-else class="font-medium text-gray-900">Store Collections</span>
      </div>

      <!-- Category Pills -->
      <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <CategoryPill
          :active="!activeSlug || activeSlug === 'all'"
          @click="handleCategoryClick('all')"
        >
          <span class="flex items-center gap-2">
            <span>All</span>
            <span v-if="totalProductsCount" class="text-xs opacity-75">({{ totalProductsCount }})</span>
          </span>
        </CategoryPill>

        <CategoryPill
          v-for="category in categories"
          :key="category.id"
          :active="activeSlug === category.slug"
          @click="handleCategoryClick(category.slug)"
        >
          <span class="flex items-center gap-2">
            <span v-if="category.icon">{{ category.icon }}</span>
            <span>{{ category.name }}</span>
            <span v-if="category.products_count" class="text-xs opacity-75">({{ category.products_count }})</span>
          </span>
        </CategoryPill>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>