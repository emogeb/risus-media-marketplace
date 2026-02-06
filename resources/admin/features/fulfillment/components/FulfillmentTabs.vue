<template>
  <div>
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="[
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }} ({{ tab.count }})
        </button>
      </nav>
    </div>
    <component :is="activeComponent" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ToPackListCard from './ToPackListCard.vue'
import ToShipListCard from './ToShipListCard.vue'
import StorePickupListCard from './StorePickupListCard.vue'
import { useFulfillmentQueues } from '../composables/useFulfillmentQueues'

const { data: queuesData } = useFulfillmentQueues()

const activeTab = ref<'toPack' | 'toShip' | 'toPickup'>('toPack')

// Ensure arrays are never undefined
const toPack = computed(() => queuesData.value?.toPack ?? [])
const toShip = computed(() => queuesData.value?.toShip ?? [])
const toPickup = computed(() => queuesData.value?.toPickup ?? [])

const tabs = computed(() => [
  { id: 'toPack' as const, label: 'Paketlenecek', count: toPack.value.length },
  { id: 'toShip' as const, label: 'Kargoya Verilecek', count: toShip.value.length },
  { id: 'toPickup' as const, label: 'Mağazadan Alınacak', count: toPickup.value.length },
])

const activeComponent = computed(() => {
  const components = {
    toPack: ToPackListCard,
    toShip: ToShipListCard,
    toPickup: StorePickupListCard,
  }
  return components[activeTab.value]
})
</script>
