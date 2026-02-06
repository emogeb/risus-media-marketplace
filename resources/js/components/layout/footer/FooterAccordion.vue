<template>
  <div class="border-b border-gray-800 last:border-b-0">
    <button
      @click="toggle"
      class="w-full flex items-center justify-between py-4 text-left"
      :aria-expanded="isOpen"
    >
      <h4 class="text-sm font-semibold text-white">{{ t(column.title) }}</h4>
      <svg
        class="w-5 h-5 text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <ul v-show="isOpen" class="space-y-3 pb-4 overflow-hidden">
        <li v-for="link in column.links" :key="link.href">
          <a 
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener noreferrer' : undefined"
            class="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <component v-if="link.icon" :is="link.icon" class="w-5 h-5" />
            <span>{{ t(link.label) }}</span>
            <svg v-if="link.external" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useT } from '@/composables/useT';

const { t } = useT();

interface FooterLink {
  label: string
  href: string
  icon?: any
  external?: boolean
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

defineProps<{
  column: FooterColumn
}>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
