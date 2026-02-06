<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';
import ProductGallerySlider from '@/components/product/ProductGallerySlider.vue';
import ProductInfoPanel from '@/components/product/ProductInfoPanel.vue';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

import { onMounted } from 'vue';

onMounted(() => {
  try {
    const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const newItem = {
      id: props.product.id,
      name: props.product.title,
      slug: props.product.slug,
      storeSlug: props.product.store_slug,
      imageUrl: props.product.images[0]?.url || '',
      price: `${props.product.currency} ${props.product.price}`,
      storeName: props.product.designer
    };

    // Remove if exists (to move to top)
    const filtered = history.filter((h: any) => h.id !== newItem.id);
    
    // Add to front
    filtered.unshift(newItem);
    
    // Limit to 8
    const limited = filtered.slice(0, 8);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(limited));
  } catch (e) {
    console.error('Error saving recently viewed', e);
  }
});
</script>

<template>
  <Head :title="`${product.title} - ${product.designer} - Risus Media`" />

  <div class="min-h-screen bg-background">
    <Navbar />

    <div class="mx-auto max-w-7xl px-6 pb-16 pt-10 mt-16">
      <!-- Desktop: 2 kolon (SOL: 7/12 gallery + ürün bilgi) (SAĞ: 5/12 info) -->
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <!-- SOL: Ürün Bilgileri + Gallery (7/12) -->
        <div class="lg:col-span-7">
          <!-- Ürün Başlığı ve Tags (Gallery Üstünde) -->
          <div class="mb-8 space-y-4">
            <!-- Designer -->
            <p class="text-sm uppercase tracking-widest text-gray-600">
              {{ product.designer }}
            </p>

            <!-- Ürün Adı -->
            <h1 class="text-4xl font-serif font-medium text-gray-900 leading-tight">
              {{ product.title }}
            </h1>

            <!-- Condition Badges / Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(badge, index) in product.conditionBadges"
                :key="index"
                class="rounded-full border border-black/10 bg-gray-50 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-gray-700"
              >
                {{ badge }}
              </span>
            </div>

            <!-- Açıklama -->
            <p class="text-base text-gray-700 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Gallery Slider -->
          <ProductGallerySlider :images="product.images" />
        </div>

        <!-- SAĞ: Info Panel (5/12, sticky) -->
        <aside class="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <ProductInfoPanel :product="product" />
        </aside>
      </div>
    </div>
  </div>
</template>
