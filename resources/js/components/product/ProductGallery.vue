<script setup lang="ts">
import { useGallery } from '@/composables/useGallery';
import type { ProductImage } from '@/types/product';

interface Props {
  images: ProductImage[];
}

const props = defineProps<Props>();

const { activeIndex, currentImage, setIndex, prev, next, canGoPrev, canGoNext, hasImages } = useGallery(props.images);
</script>

<template>
  <div class="flex gap-6">
    <!-- Left Thumbnails (sticky) -->
    <div v-if="hasImages && images.length > 1" class="hidden lg:block w-[80px] flex-shrink-0">
      <div class="sticky top-24 space-y-3">
        <button
          v-for="(image, index) in images"
          :key="image.id"
          @click="setIndex(index)"
          class="group relative block h-20 w-20 overflow-hidden rounded-xl border-2 transition-all"
          :class="[
            index === activeIndex
              ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
              : 'border-black/10 hover:border-gray-400'
          ]"
        >
          <img
            :src="image.url"
            :alt="image.alt"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </button>
      </div>
    </div>

    <!-- Main Image -->
    <div class="flex-1">
      <div class="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
        <div class="relative aspect-[3/4] w-full">
          <img
            :src="currentImage.url"
            :alt="currentImage.alt"
            class="h-full w-full object-contain p-8"
          />

          <!-- Navigation Arrows -->
          <button
            v-if="hasImages && images.length > 1 && canGoPrev"
            @click="prev"
            class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white p-3 shadow-lg transition-all hover:bg-gray-50"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            v-if="hasImages && images.length > 1 && canGoNext"
            @click="next"
            class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white p-3 shadow-lg transition-all hover:bg-gray-50"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Mobile Thumbnails Strip (below main image on mobile) -->
        <div v-if="hasImages && images.length > 1" class="flex gap-2 overflow-x-auto p-4 lg:hidden">
          <button
            v-for="(image, index) in images"
            :key="image.id"
            @click="setIndex(index)"
            class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all"
            :class="[
              index === activeIndex
                ? 'border-gray-900 ring-2 ring-gray-900'
                : 'border-black/10'
            ]"
          >
            <img :src="image.url" :alt="image.alt" class="h-full w-full object-cover" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
