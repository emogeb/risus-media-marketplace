import { ref, computed } from 'vue';
import type { ProductImage } from '@/types/product';

export function useGallery(images: ProductImage[]) {
  // Ensure we have at least one image
  const safeImages = images && images.length > 0 ? images : [];
  const activeIndex = ref(0);

  const currentImage = computed(() => {
    if (safeImages.length === 0) {
      return {
        id: 0,
        url: 'https://placehold.co/800x1200/e5e7eb/374151?text=No+Image',
        alt: 'No image available',
      };
    }
    return safeImages[activeIndex.value] || safeImages[0];
  });

  const setIndex = (index: number) => {
    if (safeImages.length > 0 && index >= 0 && index < safeImages.length) {
      activeIndex.value = index;
    }
  };

  const next = () => {
    if (activeIndex.value < safeImages.length - 1) {
      activeIndex.value++;
    }
  };

  const prev = () => {
    if (activeIndex.value > 0) {
      activeIndex.value--;
    }
  };

  const canGoPrev = computed(() => safeImages.length > 0 && activeIndex.value > 0);
  const canGoNext = computed(() => safeImages.length > 0 && activeIndex.value < safeImages.length - 1);

  return {
    activeIndex,
    currentImage,
    setIndex,
    next,
    prev,
    canGoPrev,
    canGoNext,
    hasImages: computed(() => safeImages.length > 0),
  };
}
