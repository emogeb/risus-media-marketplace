<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
  href: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  storeName: string;
  priceLabel: string;
}>();

import { usePage, router } from '@inertiajs/vue3';

const toggleFavorite = () => {
  const props = usePage().props as any;
  const user = props.auth?.user;
  if (!user) {
    // Redirect to login or show modal
    // For now, let's redirect to login with return url
    if (confirm('Favorilere eklemek için giriş yapmalısınız.')) {
        router.visit('/login');
    }
    return;
  }
  // TODO: Emit event or call API to toggle favorite
  console.log('Toggle favorite for authenticated user');
};
</script>

<template>
  <Link :href="href" class="group block">
    <!-- Image Container with Aspect Ratio -->
    <div class="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
      <img
        :src="imageUrl"
        :alt="imageAlt"
        class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        loading="lazy"
      />
    </div>

    <!-- Product Info -->
    <div class="mt-4 space-y-1.5">
      <!-- Store Name / Designer -->
      <p class="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
        {{ storeName }}
      </p>
      
      <!-- Product Title -->
      <h3 class="font-serif text-base font-light leading-tight text-gray-900 transition-colors group-hover:text-black">
        {{ title }}
      </h3>
      
      <!-- Price -->
      <p class="text-sm font-normal text-gray-900">
        {{ priceLabel }}
      </p>
    </div>
    <!-- Favorite Button -->
    <button
      type="button"
      @click.prevent="toggleFavorite"
      class="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-gray-400 backdrop-blur-sm transition-all hover:bg-white hover:text-red-500"
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
  </Link>
</template>
