<script setup lang="ts">
import { computed, ref } from 'vue';
import { 
  X, 
  Package, 
  Truck, 
  CheckCircle, 
  Calendar, 
  CreditCard, 
  MapPin 
} from 'lucide-vue-next';
import type { Order } from '@/types/profile';
import Button from '@/components/ui/Button.vue';

const props = defineProps<{
  show: boolean;
  order?: Order;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Allow closing with ESC
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.show) {
    emit('close');
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown);
}

const statusSteps = [
  { status: 'pending', label: 'Sipariş Alındı', icon: Package },
  { status: 'processing', label: 'Hazırlanıyor', icon: Package },
  { status: 'shipped', label: 'Kargoya Verildi', icon: Truck },
  { status: 'delivered', label: 'Teslim Edildi', icon: CheckCircle },
];

const getCurrentStepIndex = (status: string) => {
  const map: Record<string, number> = {
    'pending': 0,
    'processing': 1,
    'shipped': 2,
    'delivered': 3,
    'cancelled': -1
  };
  return map[status.toLowerCase()] ?? 0;
};

const currentStep = computed(() => props.order ? getCurrentStepIndex(props.order.status) : 0);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
      @click="emit('close')"
    ></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all">
      <div v-if="order">
        <!-- Header -->
        <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 p-6 backdrop-blur-md">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Sipariş Detayı</h2>
            <p class="text-sm text-gray-500">#{{ order.id }} - {{ formatDate(order.created_at) }}</p>
          </div>
          <button 
            @click="emit('close')"
            class="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200"
          >
            <X :size="20" />
          </button>
        </div>

        <div class="p-6 space-y-8">
          <!-- Status Timeline -->
          <div v-if="order.status !== 'cancelled'" class="relative">
             <div class="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-100 rounded-full"></div>
             <div 
                class="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-black rounded-full transition-all duration-500"
                :style="{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }"
             ></div>

             <div class="relative flex justify-between">
                <div 
                  v-for="(step, index) in statusSteps" 
                  :key="step.status"
                  class="flex flex-col items-center gap-2"
                >
                  <div 
                    class="flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 bg-white"
                    :class="index <= currentStep ? 'border-black text-black' : 'border-gray-200 text-gray-300'"
                  >
                    <component :is="step.icon" :size="14" />
                  </div>
                  <span 
                    class="text-xs font-medium transition-colors duration-300"
                    :class="index <= currentStep ? 'text-black' : 'text-gray-400'"
                  >
                    {{ step.label }}
                  </span>
                </div>
             </div>
          </div>
          <div v-else class="rounded-xl bg-red-50 p-4 text-red-700 flex items-center gap-3">
             <div class="h-2 w-2 rounded-full bg-red-500"></div>
             Bu sipariş iptal edilmiştir.
          </div>

          <!-- Order Content -->
          <div class="grid gap-8 md:grid-cols-3">
             <!-- Left: Items -->
             <div class="md:col-span-2 space-y-6">
                <div v-for="store in order.order_stores" :key="store.id" class="rounded-2xl border border-gray-100 p-4">
                   <div class="mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                      <Package :size="16" class="text-gray-400" />
                      <span class="font-bold text-sm">{{ store.store_name }}</span>
                   </div>

                   <div class="space-y-4">
                      <div v-for="item in store.items" :key="item.id" class="flex items-start gap-4">
                         <div class="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                            <img 
                              v-if="item.image_url" 
                              :src="item.image_url" 
                              class="h-full w-full object-cover" 
                              alt="" 
                            />
                            <div v-else class="flex h-full w-full items-center justify-center text-gray-300">
                               <Package :size="20" />
                            </div>
                         </div>
                         <div class="flex-1">
                            <h4 class="text-sm font-medium text-gray-900 line-clamp-2">{{ item.title_snapshot }}</h4>
                            <p class="text-xs text-gray-500 mt-1">
                               {{ item.qty }} Adet x {{ item.unit_price }} {{ item.currency }}
                            </p>
                         </div>
                         <div class="text-sm font-bold">
                            {{ item.line_total }} {{ item.currency }}
                         </div>
                      </div>
                   </div>

                   <!-- Tracking Info Mockup -->
                   <div v-if="['shipped', 'delivered'].includes(order.status)" class="mt-4 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                         <Truck :size="14" />
                         <span>Kargo: <strong>Yurtiçi Kargo</strong></span>
                      </div>
                      <span class="font-mono">TK-{{ order.id }}9823</span>
                   </div>
                </div>
             </div>

             <!-- Right: Summary -->
             <div class="space-y-6">
                <!-- Payment Info -->
                <div class="rounded-2xl border border-gray-100 p-4">
                   <h3 class="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <CreditCard :size="16" />
                      Ödeme Bilgileri
                   </h3>
                   <div class="space-y-2 text-sm">
                      <div class="flex justify-between text-gray-500">
                         <span>Ara Toplam</span>
                         <span>{{ order.subtotal }} {{ order.currency }}</span>
                      </div>
                      <div class="flex justify-between text-gray-500">
                         <span>Kargo</span>
                         <span>{{ order.shipping_total }} {{ order.currency }}</span>
                      </div>
                      <div class="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
                         <span>Toplam</span>
                         <span>{{ order.grand_total }} {{ order.currency }}</span>
                      </div>
                   </div>
                </div>

                <!-- Delivery Address Mockup -->
                <div class="rounded-2xl border border-gray-100 p-4">
                   <h3 class="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <MapPin :size="16" />
                      Teslimat Adresi
                   </h3>
                   <p class="text-sm text-gray-500 leading-relaxed">
                      Ahmet Yılmaz<br>
                      Atatürk Mah. Cumhuriyet Cad.<br>
                      No: 5 D: 10<br>
                      Kadıköy / İstanbul
                   </p>
                </div>
             </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-100 bg-gray-50 p-6 flex justify-end">
           <Button variant="secondary" @click="emit('close')">Kapat</Button>
        </div>
      </div>
    
      <!-- Loading State if needed -->
      <div v-else class="p-12 flex justify-center">
         <span class="text-gray-400">Yükleniyor...</span>
      </div>
    </div>
  </div>
</template>
