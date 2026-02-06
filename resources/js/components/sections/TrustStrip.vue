<script setup lang="ts">
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-vue-next';

const features = [
  {
    title: 'Güvenli Ödeme',
    description: '256-bit SSL koruması',
    icon: ShieldCheck
  },
  {
    title: 'Hızlı Teslimat',
    description: 'Tüm Türkiye\'ye kargo',
    icon: Truck
  },
  {
    title: 'Kolay İade',
    description: '14 gün içinde iade',
    icon: RotateCcw
  },
  {
    title: 'Onaylı Satıcılar',
    description: 'Doğrulanmış mağazalar',
    icon: Award
  }
];
</script>

<template>
  <div class="border-b border-border bg-background">
    <div class="mx-auto max-w-7xl px-6 py-10">
      <div class="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
        <div v-for="feature in features" :key="feature.title" class="flex items-center gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <component :is="feature.icon" class="h-6 w-6" />
          </div>
          <div>
            <h3 class="text-sm font-semibold text-foreground">{{ feature.title }}</h3>
            <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
