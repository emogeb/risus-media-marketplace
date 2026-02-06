<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.quickActions.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.quickActions.description') }}</p>
      </div>

      <!-- Actions Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- New Product -->
        <UiButton
          :variant="canCreateProduct ? 'primary' : 'ghost'"
          :disabled="!canCreateProduct"
          class="justify-start h-auto py-3 px-4"
          @click="handleNewProduct"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <div class="text-left">
            <p class="font-medium">{{ $t('dashboard.quickActions.actions.newProduct.label') }}</p>
            <p class="text-xs opacity-70">{{ $t('dashboard.quickActions.actions.newProduct.description') }}</p>
          </div>
        </UiButton>

        <!-- New Order -->
        <UiButton
          :variant="canCreateOrder ? 'primary' : 'ghost'"
          :disabled="!canCreateOrder"
          class="justify-start h-auto py-3 px-4"
          @click="handleNewOrder"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div class="text-left">
            <p class="font-medium">{{ $t('dashboard.quickActions.actions.newOrder.label') }}</p>
            <p class="text-xs opacity-70">{{ $t('dashboard.quickActions.actions.newOrder.description') }}</p>
          </div>
        </UiButton>

        <!-- New Seller -->
        <UiButton
          :variant="canCreateSeller ? 'primary' : 'ghost'"
          :disabled="!canCreateSeller"
          class="justify-start h-auto py-3 px-4"
          @click="handleNewSeller"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div class="text-left">
            <p class="font-medium">{{ $t('dashboard.quickActions.actions.newSeller.label') }}</p>
            <p class="text-xs opacity-70">{{ $t('dashboard.quickActions.actions.newSeller.description') }}</p>
          </div>
        </UiButton>

        <!-- Fulfillment Queue -->
        <UiButton
          variant="primary"
          class="justify-start h-auto py-3 px-4"
          @click="handleFulfillmentQueue"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <div class="text-left">
            <p class="font-medium">{{ $t('dashboard.quickActions.actions.fulfillmentQueue.label') }}</p>
            <p class="text-xs opacity-70">{{ $t('dashboard.quickActions.actions.fulfillmentQueue.description') }}</p>
          </div>
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@admin/stores/auth'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { useToast } from '@admin/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { showInfo } = useToast()

const canCreateProduct = computed(() => authStore.hasPermission('products.create'))
const canCreateOrder = computed(() => authStore.hasPermission('orders.create'))
const canCreateSeller = computed(() => authStore.hasPermission('sellers.create'))

function handleNewProduct() {
  if (!canCreateProduct.value) {
    showInfo('Yetki gerekli', 'Ürün eklemek için yetkiniz bulunmuyor.')
    return
  }
  // TODO: Navigate to product create when route is ready
  showInfo('Yakında', 'Ürün ekleme sayfası yakında eklenecek.')
}

function handleNewOrder() {
  if (!canCreateOrder.value) {
    showInfo('Yetki gerekli', 'Sipariş oluşturmak için yetkiniz bulunmuyor.')
    return
  }
  router.push('/orders')
}

function handleNewSeller() {
  if (!canCreateSeller.value) {
    showInfo('Yetki gerekli', 'Satıcı eklemek için yetkiniz bulunmuyor.')
    return
  }
  router.push('/sellers')
}

function handleFulfillmentQueue() {
  router.push('/fulfillment')
}
</script>
