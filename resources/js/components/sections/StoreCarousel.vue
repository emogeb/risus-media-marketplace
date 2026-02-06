<script setup lang="ts">
import { computed } from 'vue';
import StoreCard from '@/components/cards/StoreCard.vue';

interface Store {
  id: number;
  name: string;
  slug: string;
  href: string;
  productsCount: number;
}

interface Props {
  stores: Store[];
  title?: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Featured Stores',
  subtitle: '',
});
</script>

<template>
  <div v-if="stores.length > 0" class="bg-background py-12">
    <div class="mx-auto max-w-7xl px-6">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
          <p v-if="subtitle" class="mt-2 text-gray-600">{{ subtitle }}</p>
        </div>
        <a
          href="/stores"
          class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Tüm Mağazaları Gör
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <!-- Horizontal Scrollable Carousel -->
      <div class="relative -mx-6 px-6">
        <div class="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          <div
            v-for="store in stores"
            :key="store.id"
            class="flex-shrink-0 w-[340px] snap-start"
          >
            <StoreCard :store="store" />
          </div>
        </div>
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
