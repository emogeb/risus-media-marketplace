<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

interface Store {
  id: number;
  name: string;
  slug: string;
  slogan: string;
  videoUrl: string;
  href: string;
}

const props = withDefaults(defineProps<{
  stores?: Store[];
  defaultVideoSrc?: string;
}>(), {
  stores: () => [],
  defaultVideoSrc: '/videos/Canlı_ve_Keskin_Video_Oluşturma.mp4',
});

const currentIndex = ref(0);
const intervalId = ref<number | null>(null);

const currentStore = computed(() => {
  if (!props.stores || props.stores.length === 0) return null;
  return props.stores[currentIndex.value];
});

function startCarousel() {
  if (!props.stores || props.stores.length <= 1) return;
  
  stopCarousel();
  
  intervalId.value = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.stores.length;
  }, 3300); // 3.3 seconds per user request
}

function stopCarousel() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

onMounted(() => {
  if (props.stores && props.stores.length > 0) {
    startCarousel();
  }
});

onUnmounted(() => {
  stopCarousel();
});

watch(() => props.stores, (newStores) => {
  if (newStores && newStores.length > 0) {
    startCarousel();
  } else {
    stopCarousel();
    currentIndex.value = 0;
  }
});
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden bg-black">
    <!-- Video Carousel -->
    <template v-if="stores && stores.length > 0">
      <div 
        v-for="(store, index) in stores" 
        :key="store.id"
        class="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out"
        :class="index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <video
          class="absolute inset-0 h-full w-full object-cover"
          :src="store.videoUrl"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
        />
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-black/40" />
      </div>
    </template>
    
    <!-- Default Video Fallback -->
    <template v-else>
      <video
        class="absolute inset-0 h-full w-full object-cover z-0"
        :src="defaultVideoSrc"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
      />
      <div class="absolute inset-0 bg-black/35 z-0" />
      
      <!-- Decorative gradients only for default view -->
      <div class="pointer-events-none absolute inset-0 z-0">
        <div class="absolute -right-32 -top-24 h-[520px] w-[520px] rounded-full bg-white/10 blur-2xl" />
        <div class="absolute -left-40 top-1/3 h-[640px] w-[640px] rounded-full bg-white/5 blur-3xl" />
      </div>
    </template>

    <!-- Navbar Slot -->
    <div class="relative z-50">
      <slot name="navbar" />
    </div>

    <!-- Hero Content -->
    <main class="relative z-20 flex h-full items-center justify-center text-center pointer-events-none">
      <div class="mx-auto max-w-6xl px-6 w-full pointer-events-auto">
        
        <!-- Store Content -->
        <div v-if="currentStore" class="max-w-5xl mx-auto">
           <!-- Key ensures animation restarts on change -->
           <div :key="currentStore.id" class="animate-fade-in-up"> 
              <h1 class="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl drop-shadow-2xl tracking-tight">
                {{ currentStore.name }}
              </h1>
              <p class="mb-10 text-xl text-white/90 md:text-2xl max-w-3xl mx-auto drop-shadow-lg font-light italic">
                {{ currentStore.slogan || 'Eşsiz tasarımlar ve özel koleksiyonlar.' }}
              </p>
              <a 
                :href="currentStore.href" 
                class="inline-flex items-center justify-center rounded-xl bg-white text-black px-10 py-4 text-lg font-bold transition-all hover:bg-gray-100 hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Mağazayı Keşfet
              </a>
           </div>
        </div>

        <!-- Default Slot Content -->
        <div v-else class="max-w-3xl mx-auto">
          <slot />
        </div>

      </div>
    </main>

    <!-- Carousel Indicators -->
    <div v-if="stores && stores.length > 1" class="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-3">
        <button 
           v-for="(_, index) in stores" 
           :key="index"
           @click="currentIndex = index; stopCarousel(); startCarousel();"
           class="h-2 rounded-full transition-all duration-300 shadow-md"
           :class="index === currentIndex ? 'bg-white w-12' : 'bg-white/40 w-2 hover:bg-white/70'"
           aria-label="Go to slide"
        />
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>