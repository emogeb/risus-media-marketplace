<!-- resources/js/components/profile/OrderList.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Package, Filter, ChevronRight, Loader2 } from 'lucide-vue-next';
import type { PaginatedOrders } from '@/types/profile';

const props = defineProps<{
  orders: PaginatedOrders;
  loading?: boolean;
}>();

const emit = defineEmits<{
  'load-more': [];
  'filter-change': [status: string];
  'view-details': [order: any];
}>();

const selectedStatus = ref<string>('all');

const statusFilters = [
  { value: 'all', label: 'Tümü' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'processing', label: 'Hazırlanıyor' },
  { value: 'shipped', label: 'Kargoda' },
  { value: 'delivered', label: 'Teslim Edildi' },
  { value: 'cancelled', label: 'İptal Edildi' },
];

const handleFilterChange = (status: string) => {
  selectedStatus.value = status;
  emit('filter-change', status);
};

const hasMore = computed(() => {
  return props.orders.current_page < props.orders.last_page;
});

const getStatusClass = (status: string) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border';
  switch (status.toLowerCase()) {
    case 'pending': return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
    case 'processing': return `${base} bg-blue-50 text-blue-700 border-blue-200`;
    case 'shipped': return `${base} bg-purple-50 text-purple-700 border-purple-200`;
    case 'delivered': return `${base} bg-green-50 text-green-700 border-green-200`;
    case 'cancelled': return `${base} bg-red-50 text-red-700 border-red-200`;
    default: return `${base} bg-gray-50 text-gray-700 border-gray-200`;
  }
};

const getStatusLabel = (status: string) => {
  return statusFilters.find(f => f.value === status.toLowerCase())?.label || status;
};
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <!-- Header with Filters -->
    <div class="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-xl font-bold text-gray-900">Siparişlerim</h2>
      
      <!-- Status Filter -->
      <div class="flex items-center gap-2">
        <Filter :size="18" class="text-gray-500" />
        <select
          v-model="selectedStatus"
          @change="handleFilterChange(selectedStatus)"
          class="rounded-xl border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-black focus:ring-black"
          :disabled="loading"
        >
          <option
            v-for="filter in statusFilters"
            :key="filter.value"
            :value="filter.value"
          >
            {{ filter.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="relative min-h-[400px]">
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
        <Loader2 :size="40" class="animate-spin text-black" />
      </div>

      <div v-if="orders.data.length > 0" class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50">
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Sipariş No</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tarih</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Toplam</th>
              <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Durum</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="order in orders.data"
              :key="order.id"
              class="group hover:bg-gray-50/50 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="font-mono text-sm font-bold text-gray-900">#{{ order.id }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ order.formatted_date }}
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-900">{{ order.formatted_total }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="emit('view-details', order)"
                  class="inline-flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-black transition-colors"
                >
                  Detay
                  <ChevronRight :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-300">
          <Package :size="48" />
        </div>
        <h3 class="mb-2 text-xl font-bold text-gray-900">Henüz sipariş yok</h3>
        <p class="mb-10 max-w-sm text-sm text-gray-500 leading-relaxed">
          {{ selectedStatus === 'all' ? 'Henüz hiç sipariş vermediniz. Harika ürünlerimize göz atmaya ne dersiniz?' : 'Seçili filtreye uygun sipariş bulunamadı.' }}
        </p>
        <a
          href="/"
          class="inline-flex items-center justify-center rounded-2xl bg-black px-10 py-4 text-sm font-bold text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 hover:scale-[1.05] active:scale-[0.98]"
        >
          Alışverişe Başla
        </a>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="orders.data.length > 0" class="border-t border-gray-100 p-6">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-gray-500 font-medium">
          Toplam <strong>{{ orders.total }}</strong> siparişten <strong>{{ orders.data.length }}</strong> tanesi gösteriliyor
        </p>
        
        <button
          v-if="hasMore"
          @click="emit('load-more')"
          :disabled="loading"
          class="inline-flex items-center justify-center rounded-xl border-2 border-gray-100 bg-white px-6 py-2.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-50 hover:border-gray-200 disabled:opacity-50"
        >
          Daha Fazla Yükle
        </button>
      </div>
    </div>
  </div>
</template>
