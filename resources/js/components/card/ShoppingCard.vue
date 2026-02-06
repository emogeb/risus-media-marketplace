<!-- Components/Store/ShoppingCart.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { router } from '@inertiajs/vue3';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface Props {
  show: boolean;
  items: CartItem[];
  total: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  'update-quantity': [productId: number, quantity: number];
  'remove-item': [productId: number];
}>();

const formattedTotal = computed(() => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(props.total);
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(price);
};

const increaseQuantity = (item: CartItem) => {
  if (item.quantity < item.stock) {
    emit('update-quantity', item.id, item.quantity + 1);
  }
};

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    emit('update-quantity', item.id, item.quantity - 1);
  } else {
    emit('remove-item', item.id);
  }
};

const handleCheckout = () => {
  router.visit('/checkout');
};
</script>

<template>
  <!-- Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      @click="emit('close')"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    />
  </Transition>

  <!-- Cart Sidebar -->
  <Transition
    enter-active-class="transition-transform duration-300"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-300"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="show"
      class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">
          Sepetim ({{ items.length }})
        </h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-600 text-lg">Sepetiniz boş</p>
          <p class="text-gray-500 text-sm mt-2">Alışverişe başlamak için ürün ekleyin</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex gap-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
          >
            <!-- Product Image -->
            <div class="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ formatPrice(item.price) }}
              </p>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-2 mt-3">
                <button
                  @click="decreaseQuantity(item)"
                  class="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-white transition-colors duration-200"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>

                <span class="w-8 text-center font-semibold text-gray-900">
                  {{ item.quantity }}
                </span>

                <button
                  @click="increaseQuantity(item)"
                  :disabled="item.quantity >= item.stock"
                  class="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-white transition-colors duration-200"
                  :class="item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''"
                >
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remove Button -->
            <button
              @click="emit('remove-item', item.id)"
              class="flex-shrink-0 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="items.length > 0" class="border-t border-gray-200 p-6 bg-gray-50">
        <!-- Subtotal -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-gray-600">Ara Toplam</span>
          <span class="text-xl font-bold text-gray-900">{{ formattedTotal }}</span>
        </div>

        <!-- Shipping Info -->
        <p class="text-sm text-gray-600 mb-4">
          Kargo ücreti ödeme sayfasında hesaplanacaktır.
        </p>

        <!-- Checkout Button -->
        <button
          @click="handleCheckout"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
        >
          Ödemeye Geç
        </button>

        <!-- Continue Shopping -->
        <button
          @click="emit('close')"
          class="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
        >
          Alışverişe Devam Et
        </button>
      </div>
    </div>
  </Transition>
</template>