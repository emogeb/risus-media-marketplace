<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
    <!-- Payment Methods -->
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Güvenli Ödeme</h4>
      <div class="flex flex-wrap items-center gap-3">
        <div v-for="method in paymentMethods" :key="method.name" title="method.name" class="h-8 px-2 flex items-center justify-center bg-white/5 rounded border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/10 hover:border-white/20 transition-all cursor-default select-none min-w-[50px]">
          <!-- In a real app, these would be SVGs. Using text for now but styled properly. -->
          {{ method.name }}
        </div>
      </div>
    </div>

    <!-- Shipping Partners -->
    <div class="space-y-3">
      <h4 class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Kargo Firmaları</h4>
      <div class="flex flex-wrap items-center gap-3">
        <div v-for="shipper in shippingPartners" :key="shipper.name" class="h-8 px-2 flex items-center justify-center grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
           <!-- Emulate logo text -->
           <span class="text-sm font-black text-gray-400 tracking-tighter">{{ shipper.name.split(' ')[0] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const paymentMethods = [
  { name: 'Visa' },
  { name: 'Mastercard' },
  { name: 'American Express' },
  { name: 'PayPal' },
  { name: 'Apple Pay' },
]

const shippingPartners = [
  { name: 'Aras Kargo' },
  { name: 'Yurtiçi Kargo' },
  { name: 'MNG Kargo' },
  { name: 'PTT Kargo' },
]
</script>
