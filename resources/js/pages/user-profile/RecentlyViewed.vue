<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { ShoppingBag, ExternalLink, Loader2 } from 'lucide-vue-next';

interface Product {
  id: number;
  title: string;
  slug: string;
  price: string;
  currency: string;
  cover_image: string;
  store_slug: string;
}

const props = defineProps<{
  initialProducts?: Product[];
}>();

const products = ref<Product[]>(props.initialProducts || []);
const loading = ref(false);

const ziggyReady = computed(() => typeof (window as any).route === 'function' && !!(window as any).Ziggy?.routes);

const fetchRecentlyViewed = () => {
  if (!ziggyReady.value) return;
  const ids = JSON.parse(localStorage.getItem('recently_viewed_product_ids') || '[]');
  
  if (ids.length === 0) {
    products.value = [];
    return;
  }

  loading.value = true;
  router.post(route('profile.recently-viewed'), {
    recently_viewed_ids: ids
  }, {
    preserveState: true,
    preserveScroll: true,
    only: ['recently_viewed_products'],
    onSuccess: (page) => {
        products.value = (page.props.recently_viewed_products as Product[]) || [];
    },
    onFinish: () => {
      loading.value = false;
    }
  });
};

onMounted(() => {
  if (products.value.length === 0) {
    fetchRecentlyViewed();
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">Son Görüntülenenler ({{ products.length }})</h2>
      <button 
        v-if="products.length > 0"
        @click="fetchRecentlyViewed" 
        class="text-sm font-bold text-gray-900 hover:underline inline-flex items-center gap-2"
        :disabled="loading"
      >
        <Loader2 v-if="loading" :size="14" class="animate-spin" />
        Yenile
      </button>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading && products.length === 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <div class="aspect-[3/4] rounded-xl bg-gray-100"></div>
        <div class="h-4 w-3/4 rounded bg-gray-100"></div>
        <div class="h-4 w-1/4 rounded bg-gray-100"></div>
      </div>
    </div>

    <div v-else-if="products.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-black/5 hover:shadow-md"
      >
        <!-- Product Image -->
        <div class="relative aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-50">
            <img 
                :src="product.cover_image" 
                :alt="product.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </div>

        <div class="flex-1">
          <h3 class="font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
            {{ product.title }}
          </h3>
          <p class="mt-1 text-sm font-black text-gray-900">
            {{ product.price }} {{ product.currency }}
          </p>
        </div>

        <div class="mt-4">
          <a 
            :href="`/${product.store_slug}/${product.slug}`"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-black"
          >
            <ExternalLink :size="14" />
            Ürüne Git
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-300">
        <ShoppingBag :size="40" />
      </div>
      <h3 class="mb-2 text-lg font-bold text-gray-900">Henüz ürün görüntülemediniz</h3>
      <p class="mb-8 max-w-sm text-sm text-gray-500">
        İncelediğiniz ürünler burada görünecektir. Yeni ürünleri keşfetmeye ne dersiniz?
      </p>
      <a 
        href="/"
        class="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-black"
      >
        Keşfetmeye Başla
      </a>
    </div>
  </div>
</template>
