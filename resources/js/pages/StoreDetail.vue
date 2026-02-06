<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import StoreLayout from '@/components/layout/StoreLayout.vue';

interface Store {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  description?: string;
  coverImage?: string;
  logoImage?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  imageAlt: string;
  category: string;
  categorySlug: string;
  price: number;
  currency: string;
  formattedPrice: string;
  href: string;
  storeName: string;
  storeSlug: string;
}

interface Props {
  store: Store;
  products: Product[];
  activeTab?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'products',
});

const pageTitle = computed(() => `${props.store.name} - Risus Media`);
</script>

<template>
  <Head :title="pageTitle" />

  <StoreLayout :store="store" :active-tab="activeTab">
    <!-- Products Tab -->
    <div v-if="activeTab === 'products'">
      <div class="mb-6 flex items-center justify-between ">
        <h2 class="text-2xl font-bold text-gray-900">Products</h2>
        <p class="text-gray-600">{{ products.length }} {{ products.length === 1 ? 'product' : 'products' }}</p>
      </div>

      <!-- Products Grid -->
      <div v-if="products.length > 0" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <a
          v-for="product in products"
          :key="product.id"
          :href="product.href"
          class="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
        >
          <div class="aspect-square w-full overflow-hidden bg-gray-100">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.imageAlt"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div v-else class="flex h-full items-center justify-center text-gray-400">
              No image
            </div>
          </div>
          <div class="p-4">
            <p class="mb-1 text-xs text-gray-500">{{ product.category }}</p>
            <h3 class="mb-2 font-semibold text-gray-900 group-hover:text-black line-clamp-2">
              {{ product.name }}
            </h3>
            <p class="text-lg font-bold text-gray-900">{{ product.formattedPrice }}</p>
          </div>
        </a>
      </div>

      <!-- Empty State -->
      <div v-else class="py-16 text-center">
        <div class="mb-4 text-gray-400">
          <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 class="mb-2 text-xl font-semibold text-gray-900">No products yet</h3>
        <p class="text-gray-600">This store hasn't added any products yet.</p>
      </div>
    </div>

    <!-- About Tab -->
    <div v-else-if="activeTab === 'about'" class="max-w-4xl">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">About {{ store.name }}</h2>
      
      <div class="rounded-xl border border-gray-200 bg-white p-8">
        <p v-if="store.description" class="mb-6 text-gray-700 leading-relaxed">
          {{ store.description }}
        </p>
        <p v-else class="text-gray-500 italic">
          This store hasn't added a description yet.
        </p>

        <div class="mt-8 grid gap-6 sm:grid-cols-2">
          <div class="rounded-lg bg-gray-50 p-4">
            <h3 class="mb-2 font-semibold text-gray-900">Store Information</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-600">Products:</dt>
                <dd class="font-medium text-gray-900">{{ store.productsCount }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Member since:</dt>
                <dd class="font-medium text-gray-900">2024</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-lg bg-gray-50 p-4">
            <h3 class="mb-2 font-semibold text-gray-900">Categories</h3>
            <div class="flex flex-wrap gap-2">
              <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Gelinlik
              </span>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
                Damatlık
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Tab -->
    <div v-else-if="activeTab === 'contact'" class="max-w-4xl">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">Contact {{ store.name }}</h2>
      
      <div class="rounded-xl border border-gray-200 bg-white p-8">
        <form class="space-y-6">
          <div>
            <label for="name" class="mb-2 block text-sm font-medium text-gray-900">Your Name</label>
            <input
              type="text"
              id="name"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label for="email" class="mb-2 block text-sm font-medium text-gray-900">Your Email</label>
            <input
              type="email"
              id="email"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="message" class="mb-2 block text-sm font-medium text-gray-900">Message</label>
            <textarea
              id="message"
              rows="6"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-gray-400 focus:outline-none"
              placeholder="Write your message..."
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </StoreLayout>
</template>
