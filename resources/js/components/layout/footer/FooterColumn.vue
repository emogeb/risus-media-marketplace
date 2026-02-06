<template>
  <div>
    <h4 class="text-sm font-bold text-white uppercase tracking-wider mb-6 border-l-2 border-primary pl-3">{{ t(column.title) }}</h4>
    <ul class="space-y-3">
      <li v-for="link in column.links" :key="link.href">
        <a 
          :href="link.href"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
          class="group text-sm text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 w-fit"
        >
          <span class="bg-gradient-to-r from-primary to-primary bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            {{ t(link.label) }}
          </span>
          <component v-if="link.icon" :is="link.icon" class="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          <svg v-if="link.external" class="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
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
</script>
