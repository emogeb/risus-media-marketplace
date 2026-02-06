<!-- Components/Store/Pagination.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { router } from '@inertiajs/vue3';

interface Props {
  currentPage: number;
  lastPage: number;
  total: number;
}

const props = defineProps<Props>();

const pages = computed(() => {
  const range = [];
  const delta = 2;
  
  for (let i = Math.max(2, props.currentPage - delta); i <= Math.min(props.lastPage - 1, props.currentPage + delta); i++) {
    range.push(i);
  }

  if (props.currentPage - delta > 2) {
    range.unshift('...');
  }
  if (props.currentPage + delta < props.lastPage - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (props.lastPage > 1) {
    range.push(props.lastPage);
  }

  return range;
});

const goToPage = (page: number) => {
  if (page !== props.currentPage && page >= 1 && page <= props.lastPage) {
    router.visit(`/store?page=${page}`, {
      preserveState: true,
      preserveScroll: true
    });
  }
};

const nextPage = () => {
  if (props.currentPage < props.lastPage) {
    goToPage(props.currentPage + 1);
  }
};

const prevPage = () => {
  if (props.currentPage > 1) {
    goToPage(props.currentPage - 1);
  }
};
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Page Info -->
    <div class="text-sm text-gray-600">
      Toplam <span class="font-semibold text-gray-900">{{ total }}</span> ürün
    </div>

    <!-- Pagination Controls -->
    <nav class="flex items-center gap-2">
      <!-- Previous Button -->
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center gap-1">
        <button
          v-for="(page, index) in pages"
          :key="index"
          @click="typeof page === 'number' ? goToPage(page) : null"
          :disabled="page === '...'"
          class="min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200"
          :class="[
            page === currentPage
              ? 'bg-blue-600 text-white shadow-md'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        @click="nextPage"
        :disabled="currentPage === lastPage"
        class="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  </div>
</template>