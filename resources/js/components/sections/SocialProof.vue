<script setup lang="ts">
const stats = [
  { label: 'Aktif Mağaza', value: '50+' },
  { label: 'Özel Tasarım', value: '1.2k+' },
  { label: 'Mutlu Müşteri', value: '10k+' },
  { label: 'Kategori', value: '20+' },
];
</script>

<template>
  <div class="bg-primary py-12 text-primary-foreground">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div 
          v-for="stat in stats" 
          :key="stat.label" 
          class="flex flex-col items-center text-center"
        >
          <span class="text-4xl font-bold tracking-tight md:text-5xl">{{ stat.value }}</span>
          <span class="mt-2 text-sm font-medium text-primary-foreground/80 md:text-base">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
