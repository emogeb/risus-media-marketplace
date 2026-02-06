<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { route } from 'ziggy-js';

function setLocale(locale: 'tr'|'en'|'de'|'ar') {
  router.post(route('locale.set'), { locale }, {
    preserveScroll: true,
    onSuccess: () => router.reload({ only: ['locale', 'translations'] }),
  });
}

const currentLocale = (usePage().props.locale as string) || 'en';
</script>

<template>
  <div class="flex gap-2">
    <button 
      type="button" 
      class="px-2 py-1 border rounded text-xs font-medium transition-colors"
      :class="currentLocale === 'tr' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'"
      @click="setLocale('tr')"
    >
      TR
    </button>
    <button 
      type="button" 
      class="px-2 py-1 border rounded text-xs font-medium transition-colors"
      :class="currentLocale === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'"
      @click="setLocale('en')"
    >
      EN
    </button>
    <button 
      type="button" 
      class="px-2 py-1 border rounded text-xs font-medium transition-colors"
      :class="currentLocale === 'de' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'"
      @click="setLocale('de')"
    >
      DE
    </button>
    <button 
      type="button" 
      class="px-2 py-1 border rounded text-xs font-medium transition-colors"
      :class="currentLocale === 'ar' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'"
      @click="setLocale('ar')"
    >
      AR
    </button>
  </div>
</template>
