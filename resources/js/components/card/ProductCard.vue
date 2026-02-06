<!-- Components/Card/ProductCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface MarketplaceProduct {
  id: number;
  title: string;
  slug: string;
  href: string;
  price: number;
  original_price?: number | null;
  size?: string | null;
  image: { url: string; alt: string };
  store: { name: string; slug: string };
  category: { name: string; slug: string };
}

interface Props {
  product: MarketplaceProduct;
}

const props = defineProps<Props>();

const priceLabel = computed(() => {
  // currency backend'den gelmiyorsa mevcut davranışı bozmayalım; sadece sayı basıyoruz.
  return `$${Number(props.product.price ?? 0).toLocaleString()}`;
});

const originalPriceLabel = computed(() => {
  const v = props.product.original_price;
  if (!v) return null;
  if (v <= props.product.price) return null;
  return `$${Number(v).toLocaleString()}`;
});
</script>

<template>
  <a :href="product.href" class="group block">
    <div class="overflow-hidden bg-transparent transition-all">
      <!-- Image -->
      <div class="aspect-[3/4] overflow-hidden bg-gray-50 rounded-xl">
        <img
          :src="product.image.url"
          :alt="product.image.alt"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <!-- Content -->
      <div class="p-4">
        <p class="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500 mb-1">
          {{ product.store.name }}
        </p>

        <h3 class="line-clamp-2 text-base font-serif text-gray-900 group-hover:text-black transition-colors">
          {{ product.title }}
        </h3>

        <p v-if="product.size" class="mt-1 text-xs text-gray-600">
          Size: {{ product.size }}
        </p>

        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-sm font-medium text-gray-900">
            {{ priceLabel }}
          </span>
          <span v-if="originalPriceLabel" class="text-xs text-gray-400 line-through">
            {{ originalPriceLabel }}
          </span>
        </div>
      </div>
    </div>
  </a>
</template>