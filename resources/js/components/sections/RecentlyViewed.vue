<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseSection from '@/components/ui/BaseSection.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import SimpleProductCard from '@/components/cards/SimpleProductCard.vue';

// Define Interface for stored items
interface StoredProduct {
  id: number;
  name: string;
  slug: string;
  storeSlug: string;
  imageUrl: string;
  price: string;
  storeName: string;
}

const recentProducts = ref<StoredProduct[]>([]);

onMounted(() => {
  // Simulate retrieving from localStorage (in a real app, logic would be in a composable)
  // For demo purposes, we are skipping actual localStorage logic implementation details 
  // as we don't have the product detail page logic to save items yet.
  // We will leave this empty or mock if needed, but per instructions "varsa göster".
  // Assuming empty for now as "Recently Viewed" logic needs to be hooked up on Product Detail page first.
  
  // Checking if we have any mock data or if we should just hide it
  const stored = localStorage.getItem('recentlyViewed');
  if (stored) {
    try {
      recentProducts.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse recently viewed', e);
    }
  }
});
</script>

<template>
  <BaseSection v-if="recentProducts.length > 0" class-name="bg-background border-t border-border">
    <SectionHeader title="Son Görüntülenenler" />
    
    <div class="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:gap-x-8">
      <SimpleProductCard
        v-for="product in recentProducts"
        :key="product.id"
        :href="`/${product.storeSlug}/${product.slug}`"
        :image-url="product.imageUrl"
        image-alt=""
        :title="product.name"
        :store-name="product.storeName"
        :price-label="product.price"
      />
    </div>
  </BaseSection>
</template>
