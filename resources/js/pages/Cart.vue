<script setup lang="ts">
import { ref, computed } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import Navbar from '@/components/layout/Navbar.vue';

interface CartItem {
  id: number;
  product_id: number;
  product_title: string;
  product_slug: string;
  designer: string | null;
  size: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  discount_total: number;
  tax_total: number;
  image: {
    url: string;
    alt: string;
  };
  store: {
    name: string;
    slug: string;
  };
  href: string;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  item_count: number;
}

interface Props {
  cart: Cart;
}

const props = defineProps<Props>();

const updatingItems = ref<{ [key: number]: boolean }>({});

const updateQuantity = (itemId: number, quantity: number) => {
  if (quantity < 1) return;
  
  updatingItems.value[itemId] = true;
  
  router.put(`/cart/${itemId}`, { quantity }, {
    preserveScroll: true,
    onFinish: () => {
      updatingItems.value[itemId] = false;
    },
  });
};

const removeItem = (itemId: number) => {
  if (!confirm('Are you sure you want to remove this item?')) return;
  
  router.delete(`/cart/${itemId}`, {
    preserveScroll: true,
  });
};

const proceedToCheckout = () => {
  router.get('/checkout');
};

const isEmpty = computed(() => props.cart.items.length === 0);
</script>

<template>
  <div>
    <Head title="Shopping Cart" />
    <Navbar />

    <div class="min-h-screen bg-background pt-20 pb-16">
      <div class="mx-auto max-w-7xl px-6">
        <!-- Header -->
        <div class="mb-8 border-b border-gray-200 pb-6">
          <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p class="mt-2 text-gray-600">
            {{ cart.item_count }} {{ cart.item_count === 1 ? 'item' : 'items' }} in your cart
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="isEmpty" class="flex flex-col items-center justify-center py-20">
          <div class="rounded-full bg-gray-100 p-8">
            <svg
              class="h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 class="mt-6 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
          <p class="mt-2 text-gray-600">Start shopping to add items to your cart</p>
          <a
            href="/collections"
            class="mt-8 rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Browse Collections
          </a>
        </div>

        <!-- Cart Content -->
        <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <!-- Cart Items (Left Side - 8 cols) -->
          <div class="lg:col-span-8">
            <div class="space-y-4">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md"
              >
                <div class="flex gap-6">
                  <!-- Product Image -->
                  <div class="flex-shrink-0">
                    <a :href="item.href" class="block">
                      <div class="h-32 w-24 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          :src="item.image.url"
                          :alt="item.image.alt"
                          class="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    </a>
                  </div>

                  <!-- Product Details -->
                  <div class="flex flex-1 flex-col justify-between">
                    <div>
                      <!-- Store Name -->
                      <p class="text-xs uppercase tracking-wide text-gray-500">
                        {{ item.store.name }}
                      </p>

                      <!-- Product Title -->
                      <a :href="item.href" class="mt-1 block">
                        <h3 class="text-base font-semibold text-gray-900 hover:text-black">
                          {{ item.product_title }}
                        </h3>
                      </a>

                      <!-- Designer & Size -->
                      <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span v-if="item.designer">{{ item.designer }}</span>
                        <span v-if="item.size">Size: {{ item.size }}</span>
                      </div>

                      <!-- Discount Badge -->
                      <div v-if="item.discount_total > 0" class="mt-2">
                        <span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          -${{ item.discount_total.toFixed(2) }} discount
                        </span>
                      </div>
                    </div>

                    <!-- Bottom Row: Quantity & Price -->
                    <div class="mt-4 flex items-center justify-between">
                      <!-- Quantity Controls -->
                      <div class="flex items-center gap-3">
                        <button
                          @click="updateQuantity(item.id, item.quantity - 1)"
                          :disabled="updatingItems[item.id] || item.quantity <= 1"
                          class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                          </svg>
                        </button>

                        <span class="min-w-[2rem] text-center text-sm font-medium text-gray-900">
                          {{ item.quantity }}
                        </span>

                        <button
                          @click="updateQuantity(item.id, item.quantity + 1)"
                          :disabled="updatingItems[item.id] || item.quantity >= 99"
                          class="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>

                        <!-- Remove Button -->
                        <button
                          @click="removeItem(item.id)"
                          class="ml-4 text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <!-- Price -->
                      <div class="text-right">
                        <p class="text-lg font-bold text-gray-900">
                          ${{ item.line_total.toFixed(2) }}
                        </p>
                        <p v-if="item.quantity > 1" class="text-xs text-gray-500">
                          ${{ item.unit_price.toFixed(2) }} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary (Right Side - 4 cols) -->
          <div class="lg:col-span-4">
            <div class="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 class="text-lg font-semibold text-gray-900">Order Summary</h2>

              <div class="mt-6 space-y-4">
                <!-- Subtotal -->
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium text-gray-900">${{ cart.subtotal.toFixed(2) }}</span>
                </div>

                <!-- Discount -->
                <div v-if="cart.discount > 0" class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Discount</span>
                  <span class="font-medium text-green-600">-${{ cart.discount.toFixed(2) }}</span>
                </div>

                <!-- Tax -->
                <div v-if="cart.tax > 0" class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">Tax</span>
                  <span class="font-medium text-gray-900">${{ cart.tax.toFixed(2) }}</span>
                </div>

                <!-- Shipping Note -->
                <div class="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                  Shipping calculated at checkout
                </div>

                <div class="border-t border-gray-200 pt-4">
                  <div class="flex items-center justify-between">
                    <span class="text-base font-semibold text-gray-900">Total</span>
                    <span class="text-2xl font-bold text-gray-900">${{ cart.total.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Checkout Button -->
              <button
                @click="proceedToCheckout"
                class="mt-6 w-full rounded-full bg-black py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <!-- Continue Shopping -->
              <a
                href="/collections"
                class="mt-4 block text-center text-sm text-gray-600 hover:text-gray-900"
              >
                Continue Shopping
              </a>

              <!-- Trust Badges -->
              <div class="mt-6 space-y-3 border-t border-gray-200 pt-6">
                <div class="flex items-center gap-3 text-sm text-gray-600">
                  <svg class="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                  <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span>Free Shipping Over $500</span>
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-600">
                  <svg class="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                  </svg>
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
