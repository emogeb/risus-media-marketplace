<template>
  <div class="space-y-6">
    <PageHeader title="Mağaza Bilgileri" description="Mağaza detaylarını görüntüleyin">
      <template #actions>
        <UiButton v-if="selectedStoreId" variant="primary" @click="handleEditStore">
          Mağazayı Düzenle
        </UiButton>
      </template>
    </PageHeader>

    <!-- Store Selector -->
    <UiCard>
      <StoreSelector
        :stores="stores"
        :is-loading="isStoresLoading"
        :error="storesError"
        :selected-store-id="selectedStoreId"
        @select="handleStoreSelect"
      />
    </UiCard>

    <!-- Store Details -->
    <template v-if="selectedStoreId">
      <!-- Quick Stats / Header Info -->
      <UiCard v-if="isStoreLoading">
        <div class="space-y-3">
          <UiSkeleton height="h-12" />
        </div>
      </UiCard>
      <UiCard v-else-if="selectedStore" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
        <div class="flex items-center gap-6">
          <div class="h-20 w-20 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
            <img v-if="selectedStore.logo_url" :src="selectedStore.logo_url" class="max-h-full max-w-full object-contain" />
            <svg v-else class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ selectedStore.name }}</h2>
            <div class="flex items-center gap-4 mt-1">
              <span class="text-sm text-gray-600 flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {{ selectedStore.slug }}
              </span>
              <UiBadge :variant="selectedStore.status === 'active' ? 'success' : 'warning'">
                {{ selectedStore.status === 'active' ? 'Aktif' : 'Pasif' }}
              </UiBadge>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- Tabs -->
      <div>
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content: General -->
        <div v-if="activeTab === 'general'" class="space-y-6">
          <UiCard title="İletişim ve Adres">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">İletişim Bilgileri</h4>
                  <div class="space-y-2">
                    <p class="text-sm">
                      <span class="text-gray-500">E-posta:</span>
                      <span class="text-gray-900 font-medium ml-2">{{ selectedStore?.email || '—' }}</span>
                    </p>
                    <p class="text-sm">
                      <span class="text-gray-500">Telefon:</span>
                      <span class="text-gray-900 font-medium ml-2">{{ selectedStore?.phone || '—' }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Adres Bilgileri</h4>
                  <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                    {{ selectedStore?.address || 'Adres bilgisi girilmemiş.' }}
                  </p>
                </div>
              </div>
            </div>
          </UiCard>

          <UiCard v-if="selectedStore?.description" title="Mağaza Açıklaması">
            <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {{ selectedStore.description }}
            </p>
          </UiCard>
        </div>

        <!-- Tab Content: Products -->
        <div v-if="activeTab === 'products'" class="space-y-6">
          <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-900">Mağaza Ürünleri</h3>
            <UiButton variant="primary" size="sm" @click="handleCreateProduct">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün Ekle
            </UiButton>
          </div>

          <UiCard padding="sm">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex-1 min-w-[200px]">
                <input
                  v-model="productFilters.q"
                  type="text"
                  placeholder="Ürünlerde ara..."
                  class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="handleProductSearch"
                />
              </div>
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input
                  v-model="productFilters.lowStock"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  @change="handleProductSearch"
                />
                <span class="text-sm text-gray-700">Düşük Stok Takibi</span>
              </label>
              <UiButton size="sm" variant="ghost" @click="resetProductFilters">Filtreleri Sıfırla</UiButton>
            </div>
          </UiCard>

          <ProductsTableCard
            :products="products"
            :is-loading="isProductsLoading"
            @edit-stock="handleEditStock"
            @view-detail="handleViewProductDetail"
          />
        </div>
      </div>

      <!-- Modals & Drawers -->
      <StockQuickEditModal
        v-if="selectedProductId"
        :is-open="!!selectedProductId"
        :product="selectedProduct"
        @close="selectedProductId = null"
      />
      <ProductDetailDrawer
        v-if="selectedProductDetailId"
        :is-open="!!selectedProductDetailId"
        :product="selectedProductDetail"
        @close="selectedProductDetailId = null"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import StoreSelector from '@admin/features/stores/components/StoreSelector.vue'
import ProductsTableCard from '@admin/features/products/components/ProductsTableCard.vue'
import StockQuickEditModal from '@admin/features/products/components/StockQuickEditModal.vue'
import ProductDetailDrawer from '@admin/features/products/components/ProductDetailDrawer.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { useStoreQuery } from '@admin/features/stores/composables/useStoreQuery'
import { useProductsQuery } from '@admin/features/products/composables/useProductsQuery'
import type { ProductsQueryParams } from '@admin/features/products/types'

const router = useRouter()

// Stores List
const storesQuery = useStoresQuery({ pageSize: 100 })
const stores = computed(() => storesQuery.data.value?.data)
const isStoresLoading = computed(() => storesQuery.isLoading.value)
const storesError = computed(() => storesQuery.error.value)

// Selected Store
const selectedStoreId = ref<string | null>(null)

// Store Detail Data
const storeQuery = useStoreQuery(() => selectedStoreId.value || '')
const selectedStore = computed(() => storeQuery.data.value?.data)
const isStoreLoading = computed(() => storeQuery.isLoading.value && !!selectedStoreId.value)

// Tabs
type TabId = 'general' | 'products'
const activeTab = ref<TabId>('general')
const tabs: { id: TabId; name: string }[] = [
  { id: 'general', name: 'Genel Bilgiler' },
  { id: 'products', name: 'Ürünler' },
]

// Product Filters & List
const productFilters = ref<{ q: string; lowStock: boolean }>({
  q: '',
  lowStock: false,
})

const queryParams = computed<ProductsQueryParams>(() => ({
  storeId: selectedStoreId.value ? Number(selectedStoreId.value) : undefined,
  q: productFilters.value.q || undefined,
  lowStock: productFilters.value.lowStock || undefined,
}))

const productsQuery = useProductsQuery(queryParams)
const products = computed(() => productsQuery.data.value?.data || [])
const isProductsLoading = computed(() => productsQuery.isLoading.value)

// Actions
function handleStoreSelect(storeId: number) {
  selectedStoreId.value = String(storeId)
  activeTab.value = 'general'
}

function handleEditStore() {
  if (selectedStoreId.value) {
    router.push({ name: 'store-edit', params: { id: selectedStoreId.value } })
  }
}

function handleCreateProduct() {
  router.push({
    name: 'product-create',
    query: { storeId: selectedStoreId.value }
  })
}

function handleProductSearch() {
  // Query is reactive, computed queryParams will trigger reload
}

function resetProductFilters() {
  productFilters.value = { q: '', lowStock: false }
}

// Product Interaction
const selectedProductId = ref<string | null>(null)
const selectedProductDetailId = ref<string | null>(null)

const selectedProduct = computed(() =>
  products.value.find(p => String(p.id) === selectedProductId.value)
)
const selectedProductDetail = computed(() =>
  products.value.find(p => String(p.id) === selectedProductDetailId.value)
)

function handleEditStock(id: string) {
  selectedProductId.value = id
}

function handleViewProductDetail(id: string) {
  selectedProductDetailId.value = id
}

// Auto-select first store if available
watch(
  () => stores.value,
  (newStores) => {
    if (newStores && newStores.length > 0 && !selectedStoreId.value) {
      selectedStoreId.value = String(newStores[0].id)
    }
  },
  { immediate: true }
)
</script>
