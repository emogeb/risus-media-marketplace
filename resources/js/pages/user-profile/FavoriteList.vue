<!-- resources/js/components/profile/FavoriteList.vue -->
<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { Heart, ShoppingBag, Trash2, Loader2, ExternalLink } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { useToast } from '@/composables/useToast';

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: string;
  currency: string;
}

const props = defineProps<{
  favorites: Product[];
  loading?: boolean;
}>();

const ziggyReady = computed(() => typeof (window as any).route === 'function' && !!(window as any).Ziggy?.routes);

const { addToast } = useToast();
const addingToCartId = ref<number | null>(null);
const removingId = ref<number | null>(null);

const addToCart = (product: Product) => {
  if (!ziggyReady.value) return;
  addingToCartId.value = product.id;
  router.post(route('cart.store'), {
    product_id: product.id,
    quantity: 1
  }, {
    preserveScroll: true,
    onSuccess: () => {
      addToast('Ürün sepete eklendi.', 'success');
    },
    onError: () => {
      addToast('Ürün sepete eklenirken bir hata oluştu.', 'error');
    },
    onFinish: () => {
      addingToCartId.value = null;
    }
  });
};

const removeFavorite = (productId: number) => {
  if (!ziggyReady.value) return;
  removingId.value = productId;
  router.post(route('favorites.toggle', productId), {}, {
    preserveScroll: true,
    onSuccess: () => {
      addToast('Ürün favorilerden kaldırıldı.', 'success', 'Geri al', () => {
        // Undo: toggle favorite back (re-add)
        router.post(route('favorites.toggle', productId), {}, {
            preserveScroll: true,
            onSuccess: () => addToast('Ürün tekrar favorilere eklendi.')
        });
      });
    },
    onFinish: () => {
      removingId.value = null;
    }
  });
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">Favorilerim ({{ favorites.length }})</h2>
    </div>

    <!-- Skeleton Loader -->
    <div v-if="loading && favorites.length === 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <div class="aspect-square rounded-xl bg-gray-100"></div>
        <div class="h-4 w-3/4 rounded bg-gray-100"></div>
        <div class="h-4 w-1/4 rounded bg-gray-100"></div>
      </div>
    </div>

    <div v-else-if="favorites.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="product in favorites" 
        :key="product.id"
        class="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-black/5 hover:shadow-md"
      >
        <!-- Product Image Placeholder -->
        <div class="relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
            <ShoppingBag :size="48" class="text-gray-200" />
            
            <button 
                @click="removeFavorite(product.id)"
                :disabled="removingId === product.id"
                class="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 p-0 text-red-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110 disabled:opacity-50"
                title="Favoriden Kaldır"
            >
                <Loader2 v-if="removingId === product.id" :size="16" class="animate-spin" />
                <Trash2 v-else :size="16" />
            </button>
        </div>

        <div class="flex-1">
          <h3 class="font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
            {{ product.name }}
          </h3>
          <p class="mt-1 text-sm font-black text-gray-900">
            {{ product.base_price }} {{ product.currency }}
          </p>
        </div>

        <div class="mt-4 flex gap-2">
          <a 
            :href="`/products/${product.slug}`"
            class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-black"
          >
            <ExternalLink :size="14" />
            Ürüne Git
          </a>
          <button 
            @click="addToCart(product)"
            :disabled="addingToCartId === product.id"
            class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-black px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-black hover:text-white disabled:opacity-50"
          >
            <Loader2 v-if="addingToCartId === product.id" :size="14" class="animate-spin" />
            <ShoppingBag v-else :size="14" />
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 px-6 text-center rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-300">
        <Heart :size="40" />
      </div>
      <h3 class="mb-2 text-lg font-bold text-gray-900">Henüz favori ürününüz yok</h3>
      <p class="mb-8 max-w-sm text-sm text-gray-500">
        Beğendiğiniz ürünleri favorilerinize ekleyerek daha sonra kolayca bulabilirsiniz.
      </p>
      <a 
        href="/"
        class="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-black"
      >
        Ürünleri Keşfet
      </a>
    </div>
  </div>
</template>
