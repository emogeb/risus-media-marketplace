<script setup lang="ts">
import { computed } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';

interface Store {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  description?: string;
  coverImage?: string;
  logoImage?: string;
}

interface Props {
  store: Store;
  activeTab?: string;
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: 'products',
});

const tabs = [
  { id: 'products', label: 'Products', icon: '🏷️' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
  { id: 'contact', label: 'Contact', icon: '📞' },
];

const isActiveTab = (tabId: string) => props.activeTab === tabId;

/**
 * Active underline “pill” konumu için:
 * 3 tab var. İstersen dinamik yaparız; şimdilik basit index tabanlı.
 */
const activeIndex = computed(() => Math.max(0, tabs.findIndex(t => t.id === props.activeTab)));
const indicatorStyle = computed(() => ({
  transform: `translateX(${activeIndex.value * 100}%)`,
  width: `${100 / tabs.length}%`,
}));
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar  />

    <!-- Store Header -->
    <div class="relative bg-gradient-to-br from-gray-900 to-gray-800 mt-20">
      <div v-if="store.coverImage" class="absolute inset-0 opacity-20">
        <img :src="store.coverImage" :alt="store.name" class="h-full w-full object-cover" />
      </div>

      <div class="relative mx-auto max-w-7xl px-6 py-16">
        <div class="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div class="flex-shrink-0">
            <div v-if="store.logoImage" class="h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-lg">
              <img :src="store.logoImage" :alt="store.name" class="h-full w-full object-cover" />
            </div>
            <div
              v-else
              class="flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-4xl font-bold text-gray-700 shadow-lg"
            >
              {{ store.name.charAt(0).toUpperCase() }}
            </div>
          </div>

          <div class="flex-1">
            <h1 class="mb-2 text-3xl font-bold text-white md:text-4xl">{{ store.name }}</h1>
            <p v-if="store.description" class="mb-4 text-gray-300 line-clamp-2">
              {{ store.description }}
            </p>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span class="flex items-center gap-2">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {{ store.productsCount }} {{ store.productsCount === 1 ? 'product' : 'products' }}
              </span>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="rounded-lg bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100">
              Follow Store
            </button>
            <button class="rounded-lg border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ Modern Store Navigation Tabs -->
    <div class="border-b border-black/5 bg-white/70 backdrop-blur-md">
      <div class="mx-auto max-w-7xl px-6">
        <div class="flex items-center justify-between gap-4 py-4">
          <!-- Tabs: pill container -->
          <div class="relative w-full md:w-auto">
            <nav
              class="relative inline-flex w-full md:w-auto items-center rounded-2xl border border-black/10 bg-white shadow-sm p-1"
              aria-label="Store navigation"
            >
              <!-- sliding indicator -->
              <div
                class="pointer-events-none absolute inset-y-1 left-1 rounded-xl bg-gray-900/5 transition-transform duration-300 ease-out"
                :style="indicatorStyle"
              />

              <a
                v-for="tab in tabs"
                :key="tab.id"
                :href="`/stores/${store.slug}?tab=${tab.id}`"
                class="relative z-10 flex min-w-0 flex-1 md:flex-none items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition"
                :class="isActiveTab(tab.id)
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'"
              >
                <span class="text-base leading-none">{{ tab.icon }}</span>
                <span class="truncate">{{ tab.label }}</span>

                <!-- active small dot -->
                <span
                  v-if="isActiveTab(tab.id)"
                  class="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-gray-900"
                  aria-hidden="true"
                />
              </a>
            </nav>
          </div>

          <!-- Right side quick actions (opsiyonel ama modern durur) -->
          <div class="hidden md:flex items-center gap-2">
            <button
              type="button"
              class="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-black/5"
            >
              Filter
            </button>
            <button
              type="button"
              class="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-black/5"
            >
              Sort
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Store Content -->
    <div class="mx-auto max-w-7xl px-6 py-8">
      <slot />
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>