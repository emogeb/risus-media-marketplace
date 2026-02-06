<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { ProductImage } from '@/types/product';

interface Props {
  images: ProductImage[];
}

const props = defineProps<Props>();

// State
const activeIndex = ref(0);
const isTransitioning = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const imageLoading = ref<{ [key: number]: boolean }>({});

// Computed
const currentImage = computed(() => {
  if (!props.images || props.images.length === 0) {
    return {
      id: 0,
      url: 'https://placehold.co/800x1200/e5e7eb/374151?text=No+Image',
      alt: 'No image available',
    };
  }
  return props.images[activeIndex.value] || props.images[0];
});

const hasMultipleImages = computed(() => props.images && props.images.length > 1);
const canGoPrev = computed(() => hasMultipleImages.value && activeIndex.value > 0);
const canGoNext = computed(() => hasMultipleImages.value && activeIndex.value < props.images.length - 1);

// Image counter
const imageCounter = computed(() => {
  if (!hasMultipleImages.value) return '';
  return `${activeIndex.value + 1} / ${props.images.length}`;
});

// Methods
const setActiveImage = (index: number) => {
  if (isTransitioning.value) return;
  if (index >= 0 && index < props.images.length) {
    isTransitioning.value = true;
    activeIndex.value = index;
    setTimeout(() => {
      isTransitioning.value = false;
    }, 300);
  }
};

const nextImage = () => {
  if (canGoNext.value && !isTransitioning.value) {
    setActiveImage(activeIndex.value + 1);
  }
};

const prevImage = () => {
  if (canGoPrev.value && !isTransitioning.value) {
    setActiveImage(activeIndex.value - 1);
  }
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft') prevImage();
};

// Touch/Swipe support
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextImage(); // Swipe left
    } else {
      prevImage(); // Swipe right
    }
  }
  
  touchStartX.value = 0;
  touchEndX.value = 0;
};

// Image loading
const handleImageLoad = (index: number) => {
  imageLoading.value[index] = false;
};

const handleImageError = (index: number) => {
  imageLoading.value[index] = false;
  console.error(`Failed to load image at index ${index}`);
};

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  // Preload first image
  if (props.images.length > 0) {
    imageLoading.value[0] = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <section class="min-w-0">
    <div class="w-full">
      <!-- Main image area -->
      <div class="w-full">
        <div class="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
          <div
            class="relative"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <!-- Main image container -->
            <div class="relative min-h-[600px] w-full">
              <!-- Loading skeleton -->
              <div
                v-if="imageLoading[activeIndex]"
                class="absolute inset-0 animate-pulse bg-gray-200"
              />
              
              <!-- Image -->
              <img
                :src="currentImage.url"
                :alt="currentImage.alt"
                class="h-full w-full object-contain p-2 transition-opacity duration-300 md:p-6"
                :class="{ 'opacity-0': imageLoading[activeIndex] }"
                style="max-height: 85vh;"
                @load="handleImageLoad(activeIndex)"
                @error="handleImageError(activeIndex)"
              />

              <!-- Image counter (top right) -->
              <div
                v-if="hasMultipleImages"
                class="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur"
              >
                {{ imageCounter }}
              </div>

              <!-- Navigation arrows -->
              <button
                v-if="canGoPrev"
                @click="prevImage"
                :disabled="isTransitioning"
                class="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 p-3 shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous image"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                v-if="canGoNext"
                @click="nextImage"
                :disabled="isTransitioning"
                class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white/80 p-3 shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next image"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Gallery Navigation (Tüm Görseller) -->
        <div v-if="hasMultipleImages" class="mt-6">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">
              All Images ({{ images.length }})
            </h3>
            <button
              @click="setActiveImage(0)"
              class="text-xs text-gray-600 hover:text-gray-900 transition"
            >
              View First
            </button>
          </div>
          
          <!-- Grid of all images -->
          <div class="grid grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <button
              v-for="(image, index) in images"
              :key="image.id"
              @click="setActiveImage(index)"
              :disabled="isTransitioning"
              class="group relative aspect-[3/4] overflow-hidden rounded-xl border transition-all disabled:cursor-not-allowed"
              :class="[
                index === activeIndex
                  ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-lg'
                  : 'border-black/10 hover:border-black/25 hover:shadow-md'
              ]"
            >
              <img
                :src="image.url"
                :alt="image.alt"
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              
              <!-- Image number badge -->
              <div class="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                {{ index + 1 }}
              </div>
              
              <!-- Active indicator -->
              <div
                v-if="index === activeIndex"
                class="absolute inset-0 flex items-center justify-center bg-black/30"
              >
                <svg class="h-10 w-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
