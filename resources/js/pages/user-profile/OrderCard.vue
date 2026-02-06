<!-- resources/js/components/profile/OrderCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Package, ChevronRight, Truck, Clock } from 'lucide-vue-next';
import type { Order } from '@/types/profile';

const props = defineProps<{
  order: Order;
}>();

const statusConfig = computed(() => {
  const configs: Record<string, { label: string; color: string; icon: any }> = {
    pending: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
    processing: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package },
    shipped: { label: 'Kargoda', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck },
    delivered: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800 border-green-200', icon: Package },
    cancelled: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800 border-red-200', icon: Package },
  };
  return configs[props.order.status] || configs.pending;
});

const paymentStatusConfig = computed(() => {
  const configs: Record<string, { label: string; color: string }> = {
    pending: { label: 'Ödeme Bekleniyor', color: 'text-yellow-600' },
    paid: { label: 'Ödendi', color: 'text-green-600' },
    failed: { label: 'Ödeme Başarısız', color: 'text-red-600' },
    refunded: { label: 'İade Edildi', color: 'text-gray-600' },
  };
  return configs[props.order.payment_status] || configs.pending;
});

const firstItems = computed(() => {
  return props.order.order_stores.flatMap(store => store.items).slice(0, 3);
});

const totalItems = computed(() => {
  return props.order.items_count;
});

const remainingItems = computed(() => {
  return Math.max(0, totalItems.value - 3);
});
</script>

<template>
  <div class="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
    <!-- Header -->
    <div class="border-b border-gray-100 bg-gray-50 p-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <component
            :is="statusConfig.icon"
            :size="20"
            class="text-gray-600"
          />
          <div>
            <p class="text-sm font-medium text-gray-900">Sipariş #{{ order.id }}</p>
            <p class="text-xs text-gray-600">{{ order.formatted_date }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            :class="[
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
              statusConfig.color
            ]"
          >
            {{ statusConfig.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Product Preview -->
      <div class="mb-4 flex gap-3">
        <div
          v-for="item in firstItems"
          :key="item.id"
          class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
        >
          <img
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.title_snapshot"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full items-center justify-center">
            <Package :size="24" class="text-gray-400" />
          </div>
        </div>
        
        <div v-if="remainingItems > 0" class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <span class="text-sm font-medium text-gray-600">+{{ remainingItems }}</span>
        </div>
      </div>

      <!-- Order Info -->
      <div class="mb-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Ürün Sayısı</span>
          <span class="font-medium text-gray-900">{{ totalItems }} ürün</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Ödeme Durumu</span>
          <span :class="['font-medium', paymentStatusConfig.color]">
            {{ paymentStatusConfig.label }}
          </span>
        </div>
        <div class="flex justify-between border-t border-gray-100 pt-2">
          <span class="font-medium text-gray-900">Toplam</span>
          <span class="text-lg font-bold text-gray-900">{{ order.formatted_total }}</span>
        </div>
      </div>

      <!-- View Details Button -->
      <a
        :href="`/orders/${order.id}`"
        class="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50"
      >
        Sipariş Detayları
        <ChevronRight :size="16" />
      </a>
    </div>
  </div>
</template>
