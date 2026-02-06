<template>
  <div class="space-y-6">
    <PageHeader title="Siparişler" description="Tüm siparişleri görüntüleyin ve yönetin" />
    <SavedViewsBar :filters="filters" @view-selected="handleViewSelected" />
    <OrdersFiltersBar :initial-filters="filters" @filters-changed="handleFiltersChanged" />
    <OrdersBulkActionBar
      v-if="hasSelection"
      :selected-count="selectedIds.length"
      :can-update="canUpdate"
      :is-pending="bulkUpdateStatus.isPending.value"
      @apply-status="handleBulkStatusUpdate"
      @clear-selection="selectedIds = []"
    />
    <OrdersTableCard
      :orders="orders"
      :is-loading="isLoading"
      :has-filters="hasFilters"
      :selected-ids="selectedIds"
      @order-clicked="handleOrderClick"
      @clear-filters="handleClearFilters"
      @selection-change="selectedIds = $event"
    />
    <OrderDetailDrawer
      :is-open="selectedOrderId !== null"
      :order-id="selectedOrderId || undefined"
      @close="selectedOrderId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import SavedViewsBar from '@admin/features/orders/components/SavedViewsBar.vue'
import OrdersFiltersBar from '@admin/features/orders/components/OrdersFiltersBar.vue'
import OrdersTableCard from '@admin/features/orders/components/OrdersTableCard.vue'
import OrdersBulkActionBar from '@admin/features/orders/components/OrdersBulkActionBar.vue'
import OrderDetailDrawer from '@admin/features/orders/components/OrderDetailDrawer.vue'
import { useOrdersQuery } from '@admin/features/orders/composables/useOrdersQuery'
import { useOrderMutations } from '@admin/features/orders/composables/useOrderMutations'
import { useAuthStore } from '@admin/stores/auth'
import { useToast } from '@admin/composables/useToast'
import { useUrlTableState } from '@admin/composables/useUrlTableState'
import type { OrdersQueryParams, OrderStatus } from '@admin/features/orders/types'

const route = useRoute()
const selectedOrderId = ref<string | null>(null)
const selectedIds = ref<string[]>([])
const authStore = useAuthStore()
const { showSuccess, showError } = useToast()
const { bulkUpdateStatus } = useOrderMutations()

const canUpdate = computed(() => authStore.hasPermission('orders.update'))
const hasSelection = computed(() => selectedIds.value.length > 0)

// URL-synced table state
const { state: filters, setState: setFilters, resetState: resetFilters } = useUrlTableState<OrdersQueryParams>(
  {},
  {
    page: { type: 'number' },
    pageSize: { type: 'number' },
    status: { type: 'string' },
    payment_status: { type: 'string' },
    fulfillment_type: { type: 'string' },
    from: { type: 'string' },
    to: { type: 'string' },
    bridalStatus: { type: 'string' },
    bridal_status: { type: 'string' },
  }
)

const { data: ordersData, isLoading } = useOrdersQuery(filters)
const orders = computed(() => ordersData.value?.data)

const hasFilters = computed(() => {
  return !!(
    filters.value.status ||
    filters.value.payment_status ||
    filters.value.fulfillment_type ||
    filters.value.from ||
    filters.value.to ||
    filters.value.bridalStatus
  )
})

function handleFiltersChanged(newFilters: OrdersQueryParams) {
  setFilters(newFilters)
}

function handleViewSelected(newFilters: OrdersQueryParams) {
  setFilters(newFilters)
}

function handleClearFilters() {
  resetFilters()
}

function handleOrderClick(id: string) {
  selectedOrderId.value = id
}

async function handleBulkStatusUpdate(status: OrderStatus) {
  if (selectedIds.value.length === 0) return

  try {
    await bulkUpdateStatus.mutateAsync({
      ids: selectedIds.value,
      status,
    })
    showSuccess(`${selectedIds.value.length} sipariş güncellendi`)
    selectedIds.value = []
  } catch (error) {
    showError('Güncelleme başarısız', 'Sipariş durumları güncellenirken bir hata oluştu.')
  }
}

// ESC key to clear selection
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedIds.value.length > 0) {
    selectedIds.value = []
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // Clear selection on route change
  selectedIds.value = []
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
