<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import ProductSpecsTable from './ProductSpecsTable.vue';
import ProductAccordion from './ProductAccordion.vue';
import type { Product } from '@/types/product';
import { ensureCsrfCookie } from '@/lib/csrf';
import { useToastStore } from '@/stores/toast';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const isWishlisted = ref(false);
const processing = ref(false);
const toast = useToastStore();

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value;
};

const addToCart = async () => {
  processing.value = true;
  await ensureCsrfCookie();
  
  router.post('/cart', {
    product_id: props.product.id,
    quantity: 1,
  }, {
    preserveScroll: true,
    onSuccess: () => {
      toast.add('Ürün sepete başarıyla eklendi', 'success');
      processing.value = false;
    },
    onError: () => {
      toast.add('Ürün sepete eklenirken bir hata oluştu', 'error');
      processing.value = false;
    },
  });
};

const bookTryOn = () => {
  // TODO: Implement book try-on
  console.log('Book try-on appointment');
};
</script>

<template>
  <div class="space-y-6">

    <!-- Price Block -->
    <div class="flex items-baseline gap-3">
      <span class="text-3xl font-bold text-gray-900">
        {{ product.currency }} {{ product.price.toLocaleString() }}
      </span>
      <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">
        {{ product.currency }} {{ product.originalPrice.toLocaleString() }}
      </span>
    </div>

    <!-- Return Policy Warning -->
    <div class="rounded-xl bg-red-50 p-4 text-sm text-red-800">
      {{ product.seller.returnPolicy }}
    </div>

    <!-- Action Buttons -->
    <div class="space-y-3">
      <button
        @click="addToCart"
        :disabled="processing"
        class="w-full rounded-2xl bg-gray-900 px-6 py-4 text-base font-medium text-white transition-all hover:bg-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
      >
        {{ processing ? 'Ekleniyor...' : 'Sepete Ekle' }}
      </button>
      
      <button
        @click="bookTryOn"
        class="w-full rounded-2xl border-2 border-gray-900 bg-white px-6 py-4 text-base font-medium text-gray-900 transition-all hover:bg-gray-50"
      >
        Deneme Randevusu Al
      </button>
    </div>

    <!-- Wishlist Row -->
    <button
      @click="toggleWishlist"
      class="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
    >
      <svg
        class="h-5 w-5 transition-all"
        :class="isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none'"
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
      {{ isWishlisted ? 'Favorilerde' : 'Favorilere Ekle' }}
    </button>

    <!-- Virtual Try-On CTA -->
    <a
      href="#"
      class="flex items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-3 text-sm font-medium text-purple-900 transition-all hover:bg-purple-100"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      Sanal Denemenize Başlayın
    </a>

    <!-- Shipping Note -->
    <div class="rounded-xl border border-black/10 bg-gray-50 p-4 text-sm text-gray-700">
      <div class="flex gap-2">
        <svg class="h-5 w-5 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>{{ product.shippingNote }}</p>
      </div>
    </div>

    <!-- Product Specs Table -->
    <ProductSpecsTable :specs="product.specs" />

    <!-- Accordion -->
    <ProductAccordion :product="product" />
  </div>
</template>
