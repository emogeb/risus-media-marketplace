<!-- resources/js/components/profile/ActivitySummary.vue -->
<script setup lang="ts">
import { Package, Clock, Calendar, ExternalLink, Loader2, Shield, Smartphone } from 'lucide-vue-next';

interface RecentOrder {
  id: number;
  status: string;
  total_formatted: string;
  date: string;
}

interface SummaryData {
  orders_count: number;
  last_order_at: string | null;
  join_date: string;
  recent_orders: RecentOrder[];
  at?: string | null;
  ip?: string | null;
  ua?: string | null;
}

const props = defineProps<{
  summary: SummaryData;
  loading?: boolean;
}>();

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-100';
  }
};
</script>

<template>
  <div class="space-y-6">
    <!-- KPI Cards -->
    <div class="grid gap-4 sm:grid-cols-3">
      <!-- Total Orders -->
      <div class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-black/5 hover:shadow-md">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
          <Package :size="20" />
        </div>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Toplam Sipariş</p>
        <div v-if="loading" class="mt-2 h-8 w-16 animate-pulse rounded-lg bg-gray-100"></div>
        <p v-else class="text-2xl font-black text-gray-900 mt-1">{{ summary.orders_count }}</p>
      </div>

      <!-- Last Order -->
      <div class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-black/5 hover:shadow-md">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
          <Clock :size="20" />
        </div>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Son Sipariş</p>
        <div v-if="loading" class="mt-2 h-8 w-24 animate-pulse rounded-lg bg-gray-100"></div>
        <p v-else class="text-lg font-bold text-gray-900 mt-1 truncate">{{ summary.last_order_at || '—' }}</p>
      </div>

      <!-- Join Date -->
      <div class="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-black/5 hover:shadow-md">
        <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
          <Calendar :size="20" />
        </div>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Kayıt Tarihi</p>
        <div v-if="loading" class="mt-2 h-8 w-24 animate-pulse rounded-lg bg-gray-100"></div>
        <p v-else class="text-lg font-bold text-gray-900 mt-1">{{ summary.join_date }}</p>
      </div>
    </div>

    <!-- Trust / Security Card -->
    <div v-if="summary.at" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-black/5 hover:shadow-md">
        <div class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                <Shield :size="24" />
            </div>
            <div class="flex-1 min-w-0">
                <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Hesap Güvenliği</h3>
                <div class="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Clock :size="14" class="text-gray-400" />
                        <span>Son Giriş: <span class="font-bold text-gray-900">{{ summary.at }}</span></span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Smartphone :size="14" class="text-gray-400" />
                        <span>Cihaz: <span class="font-bold text-gray-900">{{ summary.ua }}</span></span>
                    </div>
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Shield :size="14" class="text-gray-400" />
                        <span>IP: <span class="font-bold text-gray-900">{{ summary.ip }}</span></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Activity Table -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div class="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Son Aktiviteler</h3>
        <Loader2 v-if="loading" :size="16" class="animate-spin text-gray-400" />
      </div>
      
      <div v-if="loading" class="divide-y divide-gray-100">
        <div v-for="i in 3" :key="i" class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 animate-pulse rounded-full bg-gray-100"></div>
            <div class="space-y-2">
              <div class="h-4 w-24 animate-pulse rounded bg-gray-100"></div>
              <div class="h-3 w-16 animate-pulse rounded bg-gray-50"></div>
            </div>
          </div>
          <div class="h-8 w-32 animate-pulse rounded-lg bg-gray-50"></div>
        </div>
      </div>

      <div v-else-if="summary.recent_orders.length > 0" class="divide-y divide-gray-100">
        <div 
          v-for="order in summary.recent_orders" 
          :key="order.id"
          class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50/50"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Package :size="18" />
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">Sipariş #{{ order.id }}</p>
              <p class="text-xs text-gray-500">{{ order.date }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-6">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold text-gray-900">{{ order.total_formatted }}</p>
              <div 
                class="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight"
                :class="getStatusColor(order.status)"
              >
                {{ order.status }}
              </div>
            </div>
            <button class="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all">
              <ExternalLink :size="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <div class="mb-3 flex justify-center text-gray-200">
          <Package :size="48" />
        </div>
        <p class="text-sm font-semibold text-gray-900">Henüz bir aktivite bulunmuyor</p>
        <p class="text-xs text-gray-500 mt-1 px-6">Sipariş verdikçe burası güncellenecektir.</p>
      </div>
    </div>
  </div>
</template>

