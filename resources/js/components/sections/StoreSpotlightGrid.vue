<script setup lang="ts">
import BaseSection from '@/components/ui/BaseSection.vue';
import SectionHeader from '@/components/ui/SectionHeader.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import { Store, ArrowRight, Star } from 'lucide-vue-next';

interface StoreType {
  id: number;
  name: string;
  slug: string;
  href: string;
  productsCount: number;
}

defineProps<{
  stores: StoreType[];
}>();
</script>

<template>
  <BaseSection v-if="stores.length > 0" class-name="bg-background">
    <SectionHeader 
      title="Öne Çıkan Mağazalar" 
      subtitle="En seçkin tasarımcıların özel koleksiyonlarını keşfedin."
      centered
    >
      <template #action>
        <a href="/stores" class="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
          Tüm Mağazaları Gör <ArrowRight class="ml-1 h-4 w-4" />
        </a>
      </template>
    </SectionHeader>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <BaseCard
        v-for="store in stores.slice(0, 3)"
        :key="store.id"
        :href="store.href"
        class-name="p-6 flex flex-col items-center text-center group relative overflow-hidden bg-card hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500"
      >
        <!-- Decorative Glow -->
        <div class="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 text-2xl font-bold text-primary group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner">
          {{ store.name.charAt(0) }}
        </div>
        
        <h3 class="text-xl font-bold text-foreground mb-2">{{ store.name }}</h3>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 justify-center mb-4">
            <span class="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium">Gelinlik</span>
            <span class="px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium">Abiye</span>
        </div>
        
        <div class="flex items-center gap-3 text-sm text-muted-foreground mb-6">
          <div class="flex items-center gap-1">
             <Store class="h-3.5 w-3.5" />
             <span>{{ store.productsCount }} Model</span>
          </div>
          <span class="h-1 w-1 rounded-full bg-border" />
          <div class="flex items-center text-amber-500 font-medium">
            <Star class="h-3.5 w-3.5 fill-current mr-1" />
            <span>5.0</span>
          </div>
        </div>

        <button class="w-full mt-auto rounded-xl bg-foreground text-background py-3 text-sm font-semibold transition-all duration-300 group-hover:bg-primary group-hover:text-black group-hover:shadow-lg group-hover:shadow-primary/25 transform group-hover:-translate-y-0.5">
          Koleksiyonu İncele
        </button>
      </BaseCard>
    </div>
  </BaseSection>
</template>
