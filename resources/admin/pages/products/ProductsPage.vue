<template>
  <div class="space-y-6">
    <PageHeader title="Ürünler" description="Ürünleri görüntüleyin ve stok yönetimi yapın">
      <template #actions>
        <UiButton variant="primary" @click="handleNewProduct">
          {{ $t('products.create.button') }}
        </UiButton>
      </template>
    </PageHeader>
    <ProductsFiltersBar
      :filters="filters"
      @filters-changed="handleFiltersChanged"
      @clear-filters="resetFilters"
    />
    <BulkActionBar
      :selected-ids="selectedIds"
      @clear="handleClearSelection"
    >
      <template #actions="{ selectedIds: ids, clear }">
        <UiButton
          v-if="canUpdate"
          variant="primary"
          size="sm"
          @click="handleBulkStockUpdate(ids)"
        >
          {{ $t('bulkActions.products.updateStock') }}
        </UiButton>
      </template>
    </BulkActionBar>
    <ProductsTableCard
      :products="products"
      :is-loading="isLoading"
      :error="error"
      @edit-stock="handleEditStock"
      @edit-product="handleEditProduct"
      @view-detail="handleViewDetail"
      @selection-change="selectedIds = $event"
    />
    <StockQuickEditModal
      :is-open="selectedProductId !== null && !selectedProductDetailId"
      :product="selectedProduct"
      @close="selectedProductId = null"
    />
    <ProductDetailDrawer
      :is-open="selectedProductDetailId !== null"
      :product="selectedProductDetail"
      @close="selectedProductDetailId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import BulkActionBar from '@admin/components/ui/BulkActionBar.vue'
import ProductsFiltersBar from '@admin/features/products/components/ProductsFiltersBar.vue'
import ProductsTableCard from '@admin/features/products/components/ProductsTableCard.vue'
import StockQuickEditModal from '@admin/features/products/components/StockQuickEditModal.vue'
import ProductDetailDrawer from '@admin/features/products/components/ProductDetailDrawer.vue'
import { useProductsQuery } from '@admin/features/products/composables/useProductsQuery'
import { useUrlTableState } from '@admin/composables/useUrlTableState'
import { useAuthStore } from '@admin/stores/auth'
import { useToast } from '@admin/composables/useToast'
import type { ProductsQueryParams } from '@admin/features/products/types'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showInfo } = useToast()

const selectedProductId = ref<string | null>(null)
const selectedProductDetailId = ref<string | null>(null)
const selectedIds = ref<string[]>([])

const canUpdate = computed(() => authStore.hasPermission('products.update'))

// URL-synced table state
const { state: filters, setState: setFilters, resetState: resetFilters } = useUrlTableState<ProductsQueryParams>(
  {},
  {
    q: { type: 'string' },
    search: { type: 'string' },
    status: { type: 'string' },
    storeId: { type: 'string' },
    page: { type: 'number' },
    pageSize: { type: 'number' },
    lowStock: { type: 'boolean' },
    category: { type: 'string' },
    availability: { type: 'string' },
    requiresAppointment: { type: 'boolean' },
  }
)

const productsQuery = useProductsQuery(filters)
const productsData = productsQuery.data
const isLoading = productsQuery.isLoading
const error = productsQuery.error
const products = computed(() => productsData.value?.data)

const selectedProduct = computed(() => {
  if (!selectedProductId.value || !products.value) return undefined
  return products.value.find((p) => p.id === selectedProductId.value)
})

const selectedProductDetail = computed(() => {
  if (!selectedProductDetailId.value || !products.value) return undefined
  return products.value.find((p) => p.id === selectedProductDetailId.value)
})

function handleFiltersChanged(newFilters: ProductsQueryParams) {
  // Map 'filtersChanged' event to 'filters-changed' for consistency
  setFilters(newFilters)
}

function handleEditStock(id: string) {
  selectedProductId.value = id
  selectedProductDetailId.value = null
}

function handleEditProduct(id: string) {
  router.push({ name: 'product-edit', params: { id } })
}

function handleViewDetail(id: string) {
  selectedProductDetailId.value = id
  selectedProductId.value = null
}

function handleNewProduct() {
  router.push({ name: 'product-create' })
  // TODO: CreateProductDrawer will be implemented later
  // For now, just show a placeholder action
}

function handleClearSelection() {
  selectedIds.value = []
}

function handleBulkStockUpdate(ids: string[]) {
  showInfo(
    'API entegrasyonu bekleniyor',
    `${ids.length} ürünün stoku güncellenecek`
  )
}

// ESC key to clear selection
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedIds.value.length > 0) {
    handleClearSelection()
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
