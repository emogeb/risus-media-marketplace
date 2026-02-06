<script setup lang="ts">
import { useRef } from 'vue';

interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

defineProps<{
  categories: Category[];
  activeSlug?: string;
}>();
</script>

<template>
  <div class="w-full border-b border-border bg-background py-4">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <a
          href="/"
          :class="[
            'inline-flex shrink-0 items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
            activeSlug === 'all' 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          ]"
        >
          Tümü
        </a>
        
        <a
          v-for="category in categories"
          :key="category.id"
          :href="`/collections?category=${category.slug}`"
          :class="[
            'inline-flex shrink-0 items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
            activeSlug === category.slug 
              ? 'bg-primary text-primary-foreground shadow-md' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          ]"
        >
          {{ category.name }}
          <span 
            v-if="category.products_count" 
            class="ml-2 rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] tabular-nums transition-colors"
            :class="activeSlug === category.slug ? 'bg-white/20 text-white' : ''"
          >
            {{ category.products_count }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>
