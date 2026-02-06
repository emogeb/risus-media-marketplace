<template>
  <div class="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
    <button
      :class="[
        'px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
        currentLocale === 'tr'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 hover:text-gray-900',
      ]"
      @click="setLocale('tr')"
    >
      TR
    </button>
    <button
      :class="[
        'px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
        currentLocale === 'en'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-gray-600 hover:text-gray-900',
      ]"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale as setI18nLocale } from '@admin/i18n'

const { locale } = useI18n()

const currentLocale = computed(() => locale.value as 'tr' | 'en')

function setLocale(loc: 'tr' | 'en') {
  setI18nLocale(loc)
}
</script>
