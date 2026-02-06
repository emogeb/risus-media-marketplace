<template>
  <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
    <p class="text-gray-400">
      © {{ currentYear }} Risus Media. Tüm hakları saklıdır.
    </p>
    
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/legal/terms" class="text-gray-400 hover:text-white transition-colors">
        Hizmet Koşulları
      </a>
      <span class="text-gray-600">·</span>
      <a href="/legal/privacy" class="text-gray-400 hover:text-white transition-colors">
        Gizlilik Politikası
      </a>
      <span class="text-gray-600">·</span>
      <a href="/legal/cookies" class="text-gray-400 hover:text-white transition-colors">
        Çerez Politikası
      </a>
      <span class="text-gray-600">·</span>
      <button @click="openCookieSettings" class="text-gray-400 hover:text-white transition-colors">
        Çerez Tercihleri
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const openCookieSettings = () => {
  // TODO: Implement cookie preferences modal
  alert('Çerez tercihleri modal\'ı yakında eklenecek')
  console.log('Open cookie settings modal')
}
</script>
