<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
interface Store {
  id: number;
  name: string;
  slug: string;
  href: string;
  productsCount: number;
}

interface Props {
  store: Store;
}

const props = defineProps<Props>();

// Generate initials for avatar
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Generate gradient colors based on store name
const getGradientColors = (name: string) => {
  const colors = [
    'from-purple-400 to-pink-400',
    'from-blue-400 to-cyan-400',
    'from-green-400 to-emerald-400',
    'from-orange-400 to-red-400',
    'from-indigo-400 to-purple-400',
    'from-pink-400 to-rose-400',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
</script>

<template>
  <Link
    :href="store.href"
    class="group block transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1"
  >
    <!-- Premium Store Card -->
    <div class="relative h-full overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-lg ring-1 ring-gray-200/50 transition-all duration-300 group-hover:shadow-2xl group-hover:ring-gray-300/50">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.02] pointer-events-none"></div>
      
      <div class="relative p-6 h-full flex flex-col">
        <!-- Top Badge -->
        <div class="flex items-center justify-between mb-4">
          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200/50">
            <svg class="h-3.5 w-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
            </svg>
            <span class="text-xs font-semibold text-gray-700">MAĞAZA</span>
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 backdrop-blur-sm border border-gray-200/30">
            <svg class="h-3.5 w-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="text-xs font-medium text-gray-700">{{ store.productsCount }}</span>
          </div>
        </div>

        <!-- Store Avatar with Premium Gradient -->
        <div class="flex items-center justify-center mb-6">
          <div class="relative">
            <!-- Glow Effect -->
            <div 
              :class="[
                'absolute inset-0 rounded-2xl blur-xl opacity-60 transition-opacity duration-300 group-hover:opacity-80',
                'bg-gradient-to-br',
                getGradientColors(store.name)
              ]"
            ></div>
            <!-- Avatar -->
            <div 
              :class="[
                'relative flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-bold text-white shadow-xl',
                'bg-gradient-to-br transition-transform duration-300 group-hover:scale-110',
                getGradientColors(store.name)
              ]"
            >
              <span class="drop-shadow-lg">{{ getInitials(store.name) }}</span>
            </div>
          </div>
        </div>

        <!-- Store Info -->
        <div class="text-center flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] flex items-center justify-center leading-tight mb-3 transition-colors duration-300 group-hover:text-gray-700">
            {{ store.name }}
          </h3>

          <p class="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
            {{ store.name }} mağazasından özel koleksiyonları keşfedin
          </p>

          <!-- Stats -->
          <div class="flex items-center justify-center gap-4 mb-4 text-sm">
            <div class="flex items-center gap-1.5">
              <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-gray-600 font-medium">Aktif</span>
            </div>
            <div class="h-4 w-px bg-gray-300"></div>
            <div class="flex items-center gap-1.5">
              <svg class="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
              </svg>
              <span class="text-gray-600 font-medium">{{ store.productsCount }} ürün</span>
            </div>
          </div>

          <!-- CTA Button with Light Gray Gradient -->
          <div class="mt-auto">
            <div class="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 p-[1px] transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gray-500/30">
              <div class="relative rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 px-6 py-3 transition-all duration-300">
                <div class="flex items-center justify-center gap-2 text-white font-semibold text-sm">
                  <span>Mağazayı Keşfet</span>
                  <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
</template>
