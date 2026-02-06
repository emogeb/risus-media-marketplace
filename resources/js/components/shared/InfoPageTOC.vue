<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface Props {
  items: TOCItem[]
}

const props = defineProps<Props>()
const activeId = ref<string>('')

const handleScroll = () => {
  const headingElements = props.items.map(item => 
    document.getElementById(item.id)
  ).filter(Boolean)

  // Find the currently visible heading
  for (const element of headingElements) {
    if (element) {
      const rect = element.getBoundingClientRect()
      if (rect.top >= 0 && rect.top <= 300) {
        activeId.value = element.id
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollToSection = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
</script>

<template>
  <nav class="sticky top-24 space-y-1">
    <h4 class="font-semibold text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-3">
      İçindekiler
    </h4>
    <ul class="space-y-2">
      <li
        v-for="item in items"
        :key="item.id"
        :class="[
          'text-sm transition-all duration-200',
          item.level === 2 ? 'pl-0' : 'pl-4',
        ]"
      >
        <button
          type="button"
          @click="scrollToSection(item.id)"
          :class="[
            'text-left w-full py-1 px-3 rounded-md transition-colors',
            activeId === item.id
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
        >
          {{ item.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>
