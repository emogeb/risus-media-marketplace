<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';
import CollectionSidebar from '@/components/sections/CollectionSidebar.vue';
import ProductCard from '@/components/card/ProductCard.vue';

interface Image {
  url: string;
  alt: string;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  original_price: number | null;
  size: string | null;
  designer: string | null;
  href: string;
  image: Image;
  store: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
}

interface Store {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
}

interface Filters {
  search: string;
  category: string;
  store: string;
  sort: string;
  min_price: number | null;
  max_price: number | null;
  type?: string;
  size?: string[]; // attribute code: size
  [key: string]: any;
}

interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  products: PaginatedProducts;
  categories: Category[];
  stores: Store[];
  filters: Filters;
  filterOptions?: {
    attributes: Array<{
      code: string;
      name: string;
      data_type: string;
      values: Array<{ value: string; slug: string }>;
    }>;
    types: Array<{ label: string; value: string }>;
  };
}

const props = defineProps<Props>();

// Mobilde overlay/drawer için varsayılan kapalı; desktop'ta sidebar her zaman görünür.
const sidebarOpen = ref(false);

const queryParams = computed(() => {
  const out: Record<string, any> = {};
  const f: Record<string, any> = props.filters as any;

  for (const [k, v] of Object.entries(f)) {
    if (k === 'category') continue; // category path üzerinden gidiyor
    if (v === null || v === undefined) continue;
    if (typeof v === 'string') {
      const s = v.trim();
      if (!s) continue;
      if (s === 'all') continue;
      out[k] = s;
      continue;
    }
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      out[k] = v;
      continue;
    }
    out[k] = v;
  }

  // sort default bile olsa kalsın (backend default'u var ama UI tutarlı olsun)
  if (!out.sort) out.sort = props.filters.sort || 'latest';

  return out;
});

const paginationBasePath = computed(() => {
  return props.filters.category && props.filters.category !== 'all'
    ? `/collections/${props.filters.category}`
    : '/collections';
});

const currentCategory = computed(() => {
  if (props.filters.category === 'all') return null;
  return props.categories.find(c => c.slug === props.filters.category);
});

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
  <div>
    <Head title="Collections" />
    <Navbar />

    <div class="min-h-screen bg-white pt-20">
      <div class="mx-auto max-w-[1600px] px-4 sm:px-6">
        <!-- Header -->
        <div class="border-b border-gray-200 py-6 sm:py-8">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 class="text-3xl font-serif font-medium text-gray-900 sm:text-4xl">
                {{ currentCategory ? currentCategory.name : 'Koleksiyonlar' }}
              </h1>
              <p class="mt-2 text-gray-500">
                {{ products.total }} özel parça listelendi
              </p>
            </div>

            <!-- Mobile Sidebar Toggle -->
            <button
              @click="toggleSidebar"
              class="lg:hidden inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span v-if="sidebarOpen">Hide Filters</span>
              <span v-else>Show Filters</span>
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="py-6 sm:py-8 lg:flex lg:gap-8">
          <!-- Mobile overlay -->
          <div
            v-show="sidebarOpen"
            class="fixed inset-0 z-40 bg-black/40 lg:hidden"
            @click="toggleSidebar"
          />

          <!-- Mobile drawer -->
          <div
            class="fixed inset-y-0 left-0 z-50 w-[min(92vw,380px)] transform bg-white shadow-xl transition-transform duration-200 lg:hidden"
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
          >
            <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4">
              <p class="text-sm font-semibold text-gray-900">Filters</p>
              <button
                type="button"
                class="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                @click="toggleSidebar"
              >
                Close
              </button>
            </div>
            <div class="h-full overflow-y-auto px-4 py-4 pb-24">
              <CollectionSidebar
                :categories="categories"
                :stores="stores"
                :filters="filters"
                :filter-options="filterOptions"
                class="w-full"
              />
            </div>
          </div>

          <!-- Desktop sidebar -->
          <div class="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <CollectionSidebar
              :categories="categories"
              :stores="stores"
              :filters="filters"
              :filter-options="filterOptions"
              class="w-full"
            />
          </div>

          <!-- Products Grid -->
          <div class="min-w-0 lg:flex-1">
            <!-- Empty State -->
            <div
              v-if="products.data.length === 0"
              class="flex flex-col items-center justify-center py-20 text-center"
            >
              <svg
                class="h-24 w-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">No products found</h3>
              <p class="mt-2 text-gray-500">Try adjusting your filters</p>
            </div>

            <!-- Products Grid -->
            <div
              v-else
              class="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <ProductCard
                v-for="product in products.data"
                :key="product.id"
                :product="product"
              />
            </div>

            <!-- Pagination -->
            <div
              v-if="products.last_page > 1"
              class="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                v-for="page in products.last_page"
                :key="page"
                @click="router.get(paginationBasePath, { ...queryParams, page })"
                :class="[
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  page === products.current_page
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
