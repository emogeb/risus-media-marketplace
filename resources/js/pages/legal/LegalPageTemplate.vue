<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    
    <main class="container mx-auto px-6 py-12 max-w-4xl">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{{ title }}</h1>
      
      <div class="bg-white rounded-lg shadow-sm p-8 md:p-12">
        <div class="prose prose-lg max-w-none">
          <slot>
            <p class="text-gray-600">
              Bu sayfa içeriği hazırlanmaktadır. Lütfen daha sonra tekrar kontrol edin.
            </p>
          </slot>
        </div>
        
        <div class="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          <p>Son güncelleme: {{ lastUpdated }}</p>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const props = withDefaults(defineProps<{
  title: string
  lastUpdated?: string
}>(), {
  lastUpdated: () => new Date().toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})
</script>
