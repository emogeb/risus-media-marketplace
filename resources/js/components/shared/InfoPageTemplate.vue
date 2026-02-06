<script setup lang="ts">
import { computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import InfoPageHeader from './InfoPageHeader.vue'
import InfoPageTOC from './InfoPageTOC.vue'

interface Breadcrumb {
  label: string
  href?: string
}

interface TOCItem {
  id: string
  text: string
  level: number
}

interface Props {
  title: string
  description?: string
  breadcrumbs: Breadcrumb[]
  tocItems?: TOCItem[]
  showToc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showToc: true,
  tocItems: () => []
})

const hasToc = computed(() => props.showToc && props.tocItems.length > 0)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <Navbar />

    <main class="flex-1">
      <div class="container mx-auto px-4 py-12">
        <InfoPageHeader
          :title="title"
          :description="description"
          :breadcrumbs="breadcrumbs"
        />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Main Content -->
          <div :class="hasToc ? 'lg:col-span-9' : 'lg:col-span-12'">
            <div class="prose prose-lg max-w-none dark:prose-invert">
              <slot />
            </div>
          </div>

          <!-- Table of Contents (Desktop Only) -->
          <aside v-if="hasToc" class="hidden lg:block lg:col-span-3">
            <InfoPageTOC :items="tocItems" />
          </aside>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

