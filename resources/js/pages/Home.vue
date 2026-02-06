<!-- resources/js/pages/Home.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Head } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';

import HeroVideo from '@/components/sections/HeroVideo.vue';
import StoreSpotlightGrid from '@/components/sections/StoreSpotlightGrid.vue';
import TrustStrip from '@/components/sections/TrustStrip.vue';
import TestimonialCarousel from '@/components/sections/TestimonialCarousel.vue';
import RecentlyViewed from '@/components/sections/RecentlyViewed.vue';
import BaseSection from '@/components/ui/BaseSection.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import ProductCardSwipe from '@/components/cards/ProductCardSwipe.vue';
import SimpleProductCard from '@/components/cards/SimpleProductCard.vue';
import Footer from '@/components/layout/Footer.vue';

// Props interface
interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  products_count?: number;
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
  description?: string;
  href: string;
  storeName: string;
  storeSlug: string;
  madeToOrder: boolean;
  leadTimeDays?: number;
}

interface Store {
  id: number;
  name: string;
  slug: string;
  href: string;
  productsCount: number;
}

interface Meta {
  title: string;
  description: string;
}

// Props with defaults for development
interface HeroStore {
  id: number;
  name: string;
  slug: string;
  slogan: string;
  videoUrl: string;
  href: string;
}

const props = withDefaults(defineProps<{
  categories?: Category[];
  products?: Product[];
  stores?: Store[];
  heroStores?: HeroStore[];
  activeCategory?: string;
  banners?: any[];
  meta?: Meta;
}>(), {
  categories: () => [],
  products: () => [],
  stores: () => [],
  heroStores: () => [],
  activeCategory: 'all',
  banners: () => [],
  meta: () => ({
    title: 'Home - Risus Media',
    description: 'Discover our handpicked selection of elegant products'
  })
});

// Computed properties for store carousel
const storeCarouselTitle = computed(() => {
  if (props.activeCategory === 'all') {
    return t('home.featured_stores');
  }
  const category = props.categories.find(c => c.slug === props.activeCategory);
  return category ? `${category.name} ${t('common.stores')}` : t('common.stores');
});

const storeCarouselSubtitle = computed(() => {
  const count = props.stores.length;
  return `${count} ${count === 1 ? t('home.store_found') : t('home.stores_found')}`;
});

// Featured products (first 3) will use swipe cards
const featuredProducts = computed(() => props.products.slice(0, 3));
const regularProducts = computed(() => props.products.slice(3));

import { useT } from '@/composables/useT';
import AnnouncementBanner from '@/components/sections/AnnouncementBanner.vue';

const { t } = useT();
</script>

<template>
  <Head>
    <title>{{ meta.title }}</title>
    <meta name="description" :content="meta.description" />
  </Head>

  <div class="min-h-screen bg-background font-sans text-foreground">
    <!-- Announcement Banner -->
    <AnnouncementBanner v-if="banners.length > 0" :banners="banners" />

    <!-- Hero Video Section with Navbar -->
    <HeroVideo :stores="heroStores">
      <template #navbar>
        <Navbar transparent />
      </template>

      <!-- Hero Content -->
      <template #default>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />
        
        <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <!-- Tag removed as requested -->
          <h1 class="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl tracking-tight animate-fade-in-up delay-100">
            {{ t('home.hero_title_1') }} <span class="text-primary italic font-serif">{{ t('home.hero_title_2') }}</span>
          </h1>
          <p class="mb-10 text-lg text-white/90 md:text-xl max-w-2xl mx-auto animate-fade-in-up delay-200">
            {{ t('home.hero_subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <a
              href="/collections"
              class="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-base font-bold text-white transition-all hover:bg-primary/90 hover:scale-105 shadow-lg shadow-primary/25"
            >
              {{ t('home.explore_collections') }}
            </a>
            <a
              href="/stores"
              class="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-medium text-white transition-all hover:bg-white hover:text-black"
            >
              {{ t('home.browse_stores') }}
            </a>
          </div>
        </div>
      </template>
    </HeroVideo>

    <!-- Trust Strip -->
    <TrustStrip />



    <!-- Products Section -->
    <BaseSection v-if="products.length > 0" class-name="bg-muted/30">
        <SectionHeader 
          :title="activeCategory === 'all' ? t('home.featured_collections') : (categories.find(c => c.slug === activeCategory)?.name || t('common.collections'))"
          :subtitle="activeCategory === 'all' ? t('home.editors_pick') : `${categories.find(c => c.slug === activeCategory)?.name} ${t('home.collection_designs')}`"
          centered
        />
        
        <!-- Featured Products with Swipe Cards (First 3) -->
        <div v-if="featuredProducts.length > 0" class="mb-20">
          <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProductCardSwipe
              v-for="product in featuredProducts"
              :key="product.id"
              :href="product.href"
              :image-url="product.imageUrl || 'https://placehold.co/400x600/e5e7eb/374151?text=' + encodeURIComponent(product.name)"
              :image-alt="product.imageAlt"
              :category="product.category"
              :title="product.name"
              :subtitle="product.storeName"
              :description="product.description"
              :price-label="product.formattedPrice"
            />
          </div>
        </div>

        <!-- Regular Products Grid (Remaining) -->
        <div v-if="regularProducts.length > 0">
          <div class="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h3 class="text-2xl font-bold text-foreground font-serif">{{ t('home.new_arrivals') }}</h3>
            <a href="/collections" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              {{ t('home.view_all') }}
            </a>
          </div>
          
          <div class="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4">
            <SimpleProductCard
              v-for="product in regularProducts"
              :key="product.id"
              :href="product.href"
              :image-url="product.imageUrl || 'https://placehold.co/400x600/e5e7eb/374151?text=' + encodeURIComponent(product.name)"
              :image-alt="product.imageAlt"
              :title="product.name"
              :store-name="product.storeName"
              :price-label="product.formattedPrice"
            />
          </div>
        </div>
    </BaseSection>

    <!-- Stores Spotlight -->
    <StoreSpotlightGrid 
      v-if="stores.length > 0"
      :stores="stores"
    />

    <!-- Social Proof Bar Removed -->
    
    <!-- Testimonials -->
    <TestimonialCarousel />
    
    <!-- Recently Viewed -->
    <RecentlyViewed />

    <!-- Empty State -->
    <div v-if="products.length === 0" class="py-32 text-center">
      <h2 class="mb-4 text-2xl font-semibold text-foreground">{{ t('common.empty') }}</h2>
      <p class="text-muted-foreground">{{ t('home.check_back_later') }}</p>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>