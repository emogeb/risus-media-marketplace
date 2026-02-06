<template>
  <div v-if="banners.length > 0" class="relative overflow-hidden z-[50]" :style="{ backgroundColor: currentBanner.background_color, color: currentBanner.text_color }">
    <div class="flex whitespace-nowrap py-2.5">
      <div 
        class="animate-marquee flex gap-12 text-sm font-medium tracking-wide uppercase font-serif"
        :style="{ animationDuration: '20s' }"
      >
        <!-- Repeat the text multiple times to ensure continuous flow -->
        <span v-for="i in 10" :key="i">{{ currentBanner.text }}</span>
      </div>
      <!-- Duplicate for seamless loop -->
      <div 
        class="animate-marquee flex gap-12 text-sm font-medium tracking-wide uppercase font-serif" 
        aria-hidden="true"
        :style="{ animationDuration: '20s' }"
      >
        <span v-for="i in 10" :key="i">{{ currentBanner.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Banner {
  id: number;
  text: string;
  background_color: string;
  text_color: string;
}

const props = defineProps<{
  banners: Banner[];
}>();

// Ensure we have at least one banner
const currentBanner = computed(() => {
    return props.banners[0] || {
        text: '',
        background_color: '#000000',
        text_color: '#ffffff'
    };
});
</script>

<style scoped>
.animate-marquee {
  animation: marquee linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* RTL Support */
[dir="rtl"] .animate-marquee {
  animation: marquee-rtl linear infinite;
}

@keyframes marquee-rtl {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
