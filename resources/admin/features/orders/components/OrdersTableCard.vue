<template>
  <UiCard>
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 5" :key="i" height="h-12" />
    </div>
    <div v-else-if="orders && orders.length > 0">
      <UiTable>
        <template #header>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              @change="handleSelectAll"
              @click.stop
            />
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Süreç</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
        </template>
        <template #body>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-gray-50/50 cursor-pointer transition-colors duration-200"
            @click="$emit('order-clicked', order.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap" @click.stop>
              <input
                type="checkbox"
                :checked="bulkSelection.isSelected(order.id)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                @change="handleRowSelect(order.id)"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ order.orderNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ order.customerName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <p>{{ formatCurrency(order.total) }}</p>
                <div v-if="order.dueDate" class="mt-1.5 flex items-center gap-1.5">
                  <span class="text-xs text-gray-500">Teslim: {{ formatShortDate(order.dueDate) }}</span>
                  <DueDateBadge :due-date="order.dueDate" />
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <OrderStatusBadge :status="order.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <BridalStatusBadge
                v-if="order.bridalStatus"
                :status="order.bridalStatus"
              />
              <span v-else class="text-xs text-gray-400">—</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UiBadge :variant="order.paymentStatus === 'paid' ? 'success' : 'warning'">
                {{ order.paymentStatus === 'paid' ? 'Ödendi' : 'Beklemede' }}
              </UiBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <UiButton size="sm" variant="ghost" @click.stop="$emit('order-clicked', order.id)">
                Detay
              </UiButton>
            </td>
          </tr>
        </template>
      </UiTable>
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">
        {{ hasFilters ? 'No orders found' : 'No orders yet' }}
      </h4>
      <p class="text-sm text-gray-600 mb-4 text-center max-w-sm">
        {{ hasFilters ? 'Try clearing filters or check back later.' : 'Orders will appear here once they are created.' }}
      </p>
      <UiButton v-if="hasFilters" variant="ghost" @click="$emit('clear-filters')">
        Clear filters
      </UiButton>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiTable from '@admin/components/ui/UiTable.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'
import BridalStatusBadge from './BridalStatusBadge.vue'
import DueDateBadge from './DueDateBadge.vue'
import { formatCurrency } from '@admin/lib/format'
import { formatShortDate } from '@admin/lib/date'
import { useBulkSelection } from '@admin/lib/tables/useBulkSelection'
import type { Order } from '../types'

const props = defineProps<{
  orders?: Order[]
  isLoading: boolean
  hasFilters?: boolean
}>()

const emit = defineEmits<{
  'order-clicked': [id: string]
  'clear-filters': []
  'selection-change': [ids: string[]]
}>()

const bulkSelection = useBulkSelection()

// Sync selection changes to parent
watch(
  () => bulkSelection.selectedIdsArray.value,
  (ids) => {
    emit('selection-change', ids)
  }
)

const orderIds = computed(() => props.orders?.map((o) => o.id) || [])

const isAllSelected = computed(() => bulkSelection.areAllSelected(orderIds.value))
const isIndeterminate = computed(() => bulkSelection.isIndeterminate(orderIds.value))

function handleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement
  if (!props.orders) return
  bulkSelection.toggleAll(orderIds.value)
}

function handleRowSelect(orderId: string) {
  bulkSelection.toggle(orderId)
}

// Expose selection for parent component
defineExpose({
  selectedIds: bulkSelection.selectedIdsArray,
  clearSelection: bulkSelection.clear,
})
</script>
