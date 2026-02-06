<script setup lang="ts">
import { ref } from 'vue'

interface FAQItem {
  question: string
  answer: string
}

interface Props {
  items: FAQItem[]
}

defineProps<Props>()

const openItems = ref<Set<number>>(new Set())

const toggleItem = (index: number) => {
  if (openItems.value.has(index)) {
    openItems.value.delete(index)
  } else {
    openItems.value.add(index)
  }
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
    >
      <button
        type="button"
        @click="toggleItem(index)"
        class="w-full px-6 py-4 text-left flex items-center justify-between gap-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.question }}</span>
        <svg
          class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': openItems.has(index) }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        v-show="openItems.has(index)"
        class="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 leading-relaxed"
      >
        {{ item.answer }}
      </div>
    </div>
  </div>
</template>
