<!-- Components/Store/CategorySidebar.vue -->
<script setup lang="ts">
interface Category {
  id: number;
  name: string;
  count: number;
}

interface Props {
  categories: Category[];
  selected: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:selected': [value: string];
}>();

const selectCategory = (categoryName: string) => {
  emit('update:selected', categoryName);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-bold text-gray-900 mb-4">Kategoriler</h2>
    
    <ul class="space-y-2">
      <!-- All Categories -->
      <li>
        <button
          @click="selectCategory('all')"
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between group"
          :class="selected === 'all' 
            ? 'bg-blue-50 text-blue-700 font-semibold' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <span>Tümü</span>
          <svg 
            class="w-4 h-4 transform transition-transform group-hover:translate-x-1"
            :class="selected === 'all' ? 'text-blue-700' : 'text-gray-400'"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </li>

      <!-- Category List -->
      <li v-for="category in categories" :key="category.id">
        <button
          @click="selectCategory(category.name)"
          class="w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between group"
          :class="selected === category.name 
            ? 'bg-blue-50 text-blue-700 font-semibold' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <span>{{ category.name }}</span>
          <div class="flex items-center gap-2">
            <span 
              class="text-xs px-2 py-1 rounded-full"
              :class="selected === category.name 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600'"
            >
              {{ category.count }}
            </span>
            <svg 
              class="w-4 h-4 transform transition-transform group-hover:translate-x-1"
              :class="selected === category.name ? 'text-blue-700' : 'text-gray-400'"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>