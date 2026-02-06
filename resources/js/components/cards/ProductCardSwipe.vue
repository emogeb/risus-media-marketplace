<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

export interface ProductCardSwipeProps {
  href: string;
  imageUrl: string;
  imageAlt?: string;
  category?: string;
  title: string;
  subtitle?: string;
  description?: string;
  priceLabel: string;
  className?: string;
}

const props = defineProps<ProductCardSwipeProps>();

import { usePage, router } from '@inertiajs/vue3';

const toggleFavorite = () => {
  const pageProps = usePage().props as any;
  const user = pageProps.auth?.user;
  if (!user) {
    if (confirm('Favorilere eklemek için giriş yapmalısınız.')) {
        router.visit('/login');
    }
    return;
  }
  // TODO: Logic to add to favorites
  console.log('Toggle favorite');
};
</script>

<template>
  <Link :href="href" :class="['group block', className]">
    <!-- Large Image -->
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
      <img
        :src="imageUrl"
        :alt="imageAlt || title"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        loading="lazy"
      />
      
      <!-- Subtle overlay on hover -->
      <div class="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
      
      <!-- Favorite Button -->
      <button
        type="button"
        @click.prevent="toggleFavorite"
        class="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2.5 text-gray-400 backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
    </div>

    <!-- Info Section -->
    <div class="mt-6 space-y-2">
      <!-- Category -->
      <p v-if="category" class="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
        {{ category }}
      </p>
      
      <!-- Title -->
      <h2 class="font-serif text-2xl font-light leading-tight text-gray-900">
        {{ title }}
        <span v-if="subtitle" class="block">{{ subtitle }}</span>
      </h2>
      
      <!-- Description -->
      <p v-if="description" class="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-2">
        {{ description }}
      </p>
      
      <!-- Price and CTA -->
      <div class="flex items-center justify-between pt-2">
        <span class="text-base font-normal text-gray-900">{{ priceLabel }}</span>
        <span class="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500 transition-all group-hover:gap-3 group-hover:text-gray-900">
          View Details
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </div>
  </Link>
</template>
