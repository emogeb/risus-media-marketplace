<template>
  <div class="space-y-6">
    <div>
      <router-link
        :to="{ name: 'sellers' }"
        class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Satıcılara dön
      </router-link>
      <PageHeader title="Satıcı Ürünleri" description="Bu satıcıya ait ürünleri görüntüleyin" />
    </div>
    <ProductsTableCard
      :products="products"
      :is-loading="isLoading"
      :seller-id="sellerId"
      @edit-stock="handleEditStock"
      @view-detail="handleViewDetail"
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import ProductsTableCard from '@admin/features/products/components/ProductsTableCard.vue'
import StockQuickEditModal from '@admin/features/products/components/StockQuickEditModal.vue'
import ProductDetailDrawer from '@admin/features/products/components/ProductDetailDrawer.vue'
import { useProductsQuery } from '@admin/features/products/composables/useProductsQuery'
import type { ProductsQueryParams } from '@admin/features/products/types'

const route = useRoute()
const sellerId = computed(() => String(route.params.sellerId))

const selectedProductId = ref<string | null>(null)
const selectedProductDetailId = ref<string | null>(null)

// Query with sellerId filter
const queryParams = computed<ProductsQueryParams>(() => ({
  sellerId: sellerId.value,
}))

const { data: productsData, isLoading } = useProductsQuery(queryParams)
const products = computed(() => productsData.value?.data)

const selectedProduct = computed(() => {
  if (!selectedProductId.value || !products.value) return undefined
  return products.value.find((p) => p.id === selectedProductId.value)
})

const selectedProductDetail = computed(() => {
  if (!selectedProductDetailId.value || !products.value) return undefined
  return products.value.find((p) => p.id === selectedProductDetailId.value)
})

function handleEditStock(id: string) {
  selectedProductId.value = id
  selectedProductDetailId.value = null
}

function handleViewDetail(id: string) {
  selectedProductDetailId.value = id
  selectedProductId.value = null
}
</script>
