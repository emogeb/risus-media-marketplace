<script setup lang="ts">
import { computed, ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import StoreCard from '@/components/cards/StoreCard.vue';

interface Store {
  id: number;
  name: string;
  slug: string;
  href: string;
  productsCount: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products_count: number;
}

interface PaginatedStores {
  data: Store[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  stores: PaginatedStores;
  categories: Category[];
  filters: {
    search?: string;
    category?: string;
    sort?: string;
  };
}

const props = defineProps<Props>();

const handleSearch = (query: string) => {
  router.get('/stores', { 
    ...props.filters, 
    search: query 
  }, { 
    preserveState: true 
  });
};

const handleCategoryFilter = (categorySlug: string) => {
  router.get('/stores', { 
    ...props.filters, 
    category: categorySlug 
  }, { 
    preserveState: true 
  });
};

const handleSort = (sortValue: string) => {
  router.get('/stores', { 
    ...props.filters, 
    sort: sortValue 
  }, { 
    preserveState: true 
  });
};

const searchQuery = ref(props.filters.search || '');

const handleSearchInput = (query: string) => {
  searchQuery.value = query;
};

const triggerSearch = () => {
    handleSearch(searchQuery.value);
};
</script>

<template>
  <Head title="Stores - Risus Media" />

  <div class="min-h-screen bg-background">
    <Navbar />

    <div class="mx-auto max-w-7xl px-6 py-8 mt-16">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="mb-2 text-3xl font-bold text-gray-900">Store Collections</h1>
        <p class="text-gray-600">
          {{ stores.total }} {{ stores.total === 1 ? 'store' : 'stores' }} found
        </p>
      </div>

      <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar 
          :model-value="searchQuery"
          @update:model-value="handleSearchInput"
          @search="triggerSearch"
          placeholder="Search stores..."
          class="lg:w-96"
        />

        <div class="flex flex-wrap gap-3">
          <!-- Category Filter Pills -->
          <button
            @click="handleCategoryFilter('all')"
            :class="[
              'rounded-full px-5 py-2.5 text-sm font-medium transition-all',
              (!filters.category || filters.category === 'all')
                ? 'bg-black text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            All Categories
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryFilter(category.slug)"
            :class="[
              'rounded-full px-5 py-2.5 text-sm font-medium transition-all',
              filters.category === category.slug
                ? 'bg-black text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ category.name }}
          </button>

          <!-- Sort -->
          <select
            :value="filters.sort || 'newest'"
            @change="handleSort(($event.target as HTMLSelectElement).value)"
            class="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-gray-400 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="products-desc">Most Products</option>
          </select>
        </div>
      </div>

      <!-- Stores Grid - Using Reusable Component -->
      <div v-if="stores.data.length > 0" class="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StoreCard
          v-for="store in stores.data"
          :key="store.id"
          :store="store"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="py-16 text-center">
        <div class="mb-4 text-gray-400">
          <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 class="mb-2 text-xl font-semibold text-gray-900">No stores found</h3>
        <p class="text-gray-600">Try adjusting your search or filters</p>
      </div>

      <!-- Pagination -->
      <div v-if="stores.last_page > 1" class="flex items-center justify-center gap-2">
        <button
          v-for="page in stores.last_page"
          :key="page"
          @click="router.get('/stores', { ...filters, page })"
          :class="[
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            page === stores.current_page
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>
