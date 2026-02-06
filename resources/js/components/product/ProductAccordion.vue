<script setup lang="ts">
import AccordionItem from './AccordionItem.vue';
import type { Product } from '@/types/product';

interface Props {
  product: Product;
}

defineProps<Props>();
</script>

<template>
  <div class="rounded-2xl border border-black/10 bg-white pr-4 pl-4">
    <AccordionItem title="Daha Fazla Detay" :default-open="true">
      <p>{{ product.description }}</p>
    </AccordionItem>

    <AccordionItem title="Değişiklikler">
      <p>Bu ürün değişikliklere uygundur. Detaylar için lütfen satıcı ile iletişime geçin.</p>
    </AccordionItem>

    <AccordionItem title="Müşteri Koruması">
      <p>Tüm siparişlerimiz alıcı koruma programı kapsamındadır. Eğer ürün açıklaması ile uyuşmazsa tam iade garantisi sunuyoruz.</p>
    </AccordionItem>

    <AccordionItem title="Nakliye Maliyeti">
      <p>{{ product.shippingNote }}</p>
      <p class="mt-2">Standart kargo ücretsizdir. Hızlandırılmış kargo seçenekleri ödeme sırasında görüntülenecektir.</p>
    </AccordionItem>

    <AccordionItem title="Satıcı Bilgileri">
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Satıcı:</span>
          <span class="font-medium">{{ product.seller.name }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Konum:</span>
          <span class="font-medium">{{ product.seller.location }}</span>
        </div>
        <div class="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-800">
          {{ product.seller.returnPolicy }}
        </div>
      </div>
    </AccordionItem>
  </div>
</template>
