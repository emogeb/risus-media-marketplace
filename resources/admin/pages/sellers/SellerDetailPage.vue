<template>
  <div class="space-y-6">
    <div>
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <router-link
          :to="{ name: 'sellers' }"
          class="inline-flex items-center gap-2 hover:text-gray-900 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Satıcılara dön
        </router-link>
        <span>/</span>
        <span class="text-gray-900 font-medium">{{ seller?.name || sellerId }}</span>
      </div>
      <PageHeader title="Satıcı Detayı" description="Satıcı bilgileri ve ürün yönetimi" />
    </div>

    <SellerDetailHeaderCard :seller="seller" :is-loading="isSellerLoading" />

    <!-- Tabs -->
    <div>
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            :class="[
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
            @click="activeTab = 'general'"
          >
            Genel
          </button>
          <button
            :class="[
              'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
              activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
            ]"
            @click="activeTab = 'products'"
          >
            Ürünler
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'general'">
        <UiCard>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kişisel Bilgiler</h4>
                <div class="space-y-2">
                  <p class="text-sm"><span class="text-gray-500">Ad Soyad:</span> <span class="text-gray-900 font-medium ml-1">{{ seller?.name }}</span></p>
                  <p class="text-sm"><span class="text-gray-500">E-posta:</span> <span class="text-gray-900 font-medium ml-1">{{ seller?.email }}</span></p>
                  <p class="text-sm"><span class="text-gray-500">Telefon:</span> <span class="text-gray-900 font-medium ml-1">{{ seller?.phone || '—' }}</span></p>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Şirket Bilgileri</h4>
                <div class="space-y-2">
                  <p class="text-sm"><span class="text-gray-500">Şirket Adı:</span> <span class="text-gray-900 font-medium ml-1">{{ seller?.companyName || '—' }}</span></p>
                  <p class="text-sm"><span class="text-gray-500">Vergi No:</span> <span class="text-gray-900 font-medium ml-1">{{ seller?.taxNumber || '—' }}</span></p>
                  <p class="text-sm"><span class="text-gray-500">Kayıt Tarihi:</span> <span class="text-gray-900 font-medium ml-1">{{ seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString('tr-TR') : '—' }}</span></p>
                </div>
              </div>
            </div>
          </div>
        </UiCard>
      </div>

      <div v-if="activeTab === 'products'" class="space-y-6">
        <UiCard padding="sm">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-[200px]">
              <input
                v-model="productFilters.q"
                type="text"
                placeholder="Ürün ara..."
                class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="handleProductSearchInput"
              />
            </div>
            <label class="flex items-center gap-2">
              <input
                v-model="productFilters.lowStock"
                type="checkbox"
                class="rounded border-gray-300"
                @change="applyProductFilters"
              />
              <span class="text-sm">Sadece Düşük Stok</span>
            </label>
            <UiButton size="sm" variant="ghost" @click="clearProductFilters">Temizle</UiButton>
          </div>
        </UiCard>
        <ProductsTableCard
          :products="products"
          :is-loading="isProductsLoading"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import SellerDetailHeaderCard from '@admin/features/sellers/components/SellerDetailHeaderCard.vue'
import ProductsTableCard from '@admin/features/products/components/ProductsTableCard.vue'
import StockQuickEditModal from '@admin/features/products/components/StockQuickEditModal.vue'
import ProductDetailDrawer from '@admin/features/products/components/ProductDetailDrawer.vue'
import { useSellerDetailQuery } from '@admin/features/sellers/composables/useSellerDetailQuery'
import { useProductsQuery } from '@admin/features/products/composables/useProductsQuery'
import type { ProductsQueryParams } from '@admin/features/products/types'

const route = useRoute()
const sellerId = computed(() => String(route.params.sellerId))

const activeTab = ref<'general' | 'products'>('general')

const selectedProductId = ref<string | null>(null)
const selectedProductDetailId = ref<string | null>(null)

// Seller detail query
const { data: seller, isLoading: isSellerLoading } = useSellerDetailQuery(sellerId.value)

// Product filters
const productFilters = ref<{ q?: string; lowStock?: boolean }>({})

let productSearchTimeout: ReturnType<typeof setTimeout> | null = null

function handleProductSearchInput() {
  if (productSearchTimeout) {
    clearTimeout(productSearchTimeout)
  }
  productSearchTimeout = setTimeout(() => {
    applyProductFilters()
  }, 500)
}

function applyProductFilters() {
  // Filters are reactive, query will update automatically
}

function clearProductFilters() {
  productFilters.value = {}
}

// Query with sellerId filter (only when products tab is active)
const queryParams = computed<ProductsQueryParams>(() => ({
  sellerId: activeTab.value === 'products' ? sellerId.value : undefined,
  q: activeTab.value === 'products' ? productFilters.value.q : undefined,
  lowStock: activeTab.value === 'products' ? productFilters.value.lowStock : undefined,
}))

const { data: productsData, isLoading: isProductsLoading } = useProductsQuery(queryParams)
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
