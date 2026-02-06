<!-- Components/Store/ProductFilter.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  priceRange: [number, number];
  sortBy: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:priceRange': [value: [number, number]];
  'update:sortBy': [value: string];
}>();

const localMinPrice = ref(props.priceRange[0]);
const localMaxPrice = ref(props.priceRange[1]);

watch([localMinPrice, localMaxPrice], ([min, max]) => {
  emit('update:priceRange', [min, max]);
});

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0
  }).format(value);
};

const resetFilters = () => {
  localMinPrice.value = 0;
  localMaxPrice.value = 10000;
  emit('update:sortBy', 'newest');
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-900">Filtreler</h2>
      <button
        @click="resetFilters"
        class="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Sıfırla
      </button>
    </div>

    <!-- Price Range Filter -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Fiyat Aralığı</h3>
      
      <div class="space-y-4">
        <!-- Min Price -->
        <div>
          <label class="text-xs text-gray-600 block mb-1">Minimum</label>
          <div class="relative">
            <input
              v-model.number="localMinPrice"
              type="number"
              min="0"
              :max="localMaxPrice"
              step="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2 text-gray-500">₺</span>
          </div>
        </div>

        <!-- Max Price -->
        <div>
          <label class="text-xs text-gray-600 block mb-1">Maximum</label>
          <div class="relative">
            <input
              v-model.number="localMaxPrice"
              type="number"
              :min="localMinPrice"
              max="100000"
              step="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span class="absolute right-3 top-2 text-gray-500">₺</span>
          </div>
        </div>

        <!-- Range Display -->
        <div class="pt-2 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Seçilen Aralık:</span>
            <span class="font-semibold text-gray-900">
              {{ formatPrice(localMinPrice) }} - {{ formatPrice(localMaxPrice) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock Status -->
    <div class="mb-6">
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Stok Durumu</h3>
      
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer">
          <input 
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700">Stokta Olanlar</span>
        </label>
        
        <label class="flex items-center cursor-pointer">
          <input 
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span class="ml-2 text-sm text-gray-700">Tükenenler</span>
        </label>
      </div>
    </div>

    <!-- Rating Filter -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 mb-3">Değerlendirme</h3>
      
      <div class="space-y-2">
        <label 
          v-for="rating in [5, 4, 3, 2, 1]" 
          :key="rating"
          class="flex items-center cursor-pointer group"
        >
          <input 
            type="radio"
            name="rating"
            :value="rating"
            class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <div class="ml-2 flex items-center">
            <div class="flex">
              <svg 
                v-for="i in rating" 
                :key="i"
                class="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="ml-1 text-sm text-gray-600 group-hover:text-gray-900">ve üzeri</span>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>