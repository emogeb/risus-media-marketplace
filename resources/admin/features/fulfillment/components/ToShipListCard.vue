<template>
  <UiCard>
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Kargoya Verilecek Siparişler</h3>
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 3" :key="i" height="h-16" />
    </div>
    <div v-else-if="orders && orders.length > 0" class="space-y-3">
      <div
        v-for="order in orders"
        :key="order.id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
      >
        <div>
          <p class="font-medium text-gray-900">{{ order.orderNumber }}</p>
          <p class="text-sm text-gray-600">{{ order.customerName }}</p>
        </div>
        <UiButton
          size="sm"
          :disabled="!canUpdate"
          :title="!canUpdate ? 'Kargoya verme yetkiniz yok' : ''"
        >
          Kargoya Ver
        </UiButton>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg
        class="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">No items in queue</h4>
      <p class="text-sm text-gray-600 text-center max-w-sm">
        All orders are shipped or ready for pickup.
      </p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { useFulfillmentQueues } from '../composables/useFulfillmentQueues'
import { useAuthStore } from '@admin/stores/auth'

const { data: queuesData, isLoading } = useFulfillmentQueues()
const orders = computed(() => queuesData.value?.toShip ?? [])
const authStore = useAuthStore()
const canUpdate = computed(() => authStore.hasPermission('fulfillment.update'))
</script>
