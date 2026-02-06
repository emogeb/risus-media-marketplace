<template>
  <div class="space-y-6">
    <!-- Breadcrumbs -->
    <div>
      <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <router-link
          :to="{ name: 'stores' }"
          class="inline-flex items-center gap-2 hover:text-gray-900 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Mağazalara dön
        </router-link>
        <span>/</span>
        <span class="text-gray-900 font-medium">{{ store?.name || storeId }}</span>
      </div>
      <PageHeader :title="store?.name || 'Mağaza Detayı'" description="Mağaza bilgileri ve ürün yönetimi">
        <template #actions>
          <UiButton variant="secondary" @click="router.push({ name: 'store-edit', params: { id: storeId } })">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Düzenle / IBAN Güncelle
          </UiButton>
        </template>
      </PageHeader>
    </div>

    <!-- Quick Stats / Header Info -->
    <UiCard v-if="isLoading">
      <div class="space-y-3">
        <UiSkeleton height="h-12" />
      </div>
    </UiCard>
    <UiCard v-else-if="store" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-sm">
      <div class="flex items-center gap-6">
        <div class="h-20 w-20 rounded-xl bg-white shadow-sm flex items-center justify-center p-2">
          <img v-if="store.logo_url" :src="store.logo_url" class="max-h-full max-w-full object-contain" />
          <svg v-else class="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ store.name }}</h2>
          <div class="flex items-center gap-4 mt-1">
            <span class="text-sm text-gray-600 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {{ store.slug }}
            </span>
            <UiBadge :variant="store.status === 'active' ? 'success' : 'warning'">
              {{ store.status === 'active' ? 'Aktif' : 'Pasif' }}
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
                    <span class="text-gray-900 font-medium ml-2">{{ store?.email || '—' }}</span>
                  </p>
                  <p class="text-sm">
                    <span class="text-gray-500">Telefon:</span>
                    <span class="text-gray-900 font-medium ml-2">{{ store?.phone || '—' }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Adres Bilgileri</h4>
                <p class="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  {{ store?.address || 'Adres bilgisi girilmemiş.' }}
                </p>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard title="Banka Bilgileri">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">IBAN ve Kodlar</h4>
                <div class="space-y-3">
                  <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span class="text-xs text-gray-500 block mb-1">IBAN</span>
                    <span class="text-sm font-mono font-bold text-gray-900">{{ store?.bank_iban || 'Girilmemiş' }}</span>
                  </div>
                  <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span class="text-xs text-gray-500 block mb-1">Swiss Code / BIC</span>
                    <span class="text-sm font-mono font-bold text-gray-900">{{ store?.bank_swiss_code || 'Girilmemiş' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">IBAN QR Kod</h4>
                <div v-if="(store as any)?.bank_qr_url" class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block">
                    <img :src="(store as any).bank_qr_url" class="h-32 w-32 object-contain" alt="QR Kod" />
                </div>
                <div v-else class="bg-gray-50 h-32 w-32 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-center p-4">
                    <span class="text-xs text-gray-400">QR Kod Yüklenmemiş</span>
                </div>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard v-if="store?.description" title="Mağaza Açıklaması">
          <p class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ store.description }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import ProductsTableCard from '@admin/features/products/components/ProductsTableCard.vue'
import StockQuickEditModal from '@admin/features/products/components/StockQuickEditModal.vue'
import ProductDetailDrawer from '@admin/features/products/components/ProductDetailDrawer.vue'
import { useStoreQuery } from '@admin/features/stores/composables/useStoreQuery'
import { useProductsQuery } from '@admin/features/products/composables/useProductsQuery'
import type { ProductsQueryParams } from '@admin/features/products/types'

const route = useRoute()
const router = useRouter()
const storeId = computed(() => String(route.params.id))

// Tabs
type TabId = 'general' | 'products'
const activeTab = ref<TabId>('general')
const tabs: { id: TabId; name: string }[] = [
  { id: 'general', name: 'Genel Bilgiler' },
  { id: 'products', name: 'Ürünler' },
]

// Store Detail Data
const storeQuery = useStoreQuery(() => storeId.value)
const store = computed(() => storeQuery.data.value?.data)
const isLoading = computed(() => storeQuery.isLoading.value)

// Product Filters & List
const productFilters = ref<{ q: string; lowStock: boolean }>({
  q: '',
  lowStock: false,
})

const queryParams = computed<ProductsQueryParams>(() => ({
  storeId: Number(storeId.value),
  q: productFilters.value.q || undefined,
  lowStock: productFilters.value.lowStock || undefined,
}))

const productsQuery = useProductsQuery(queryParams)
const products = computed(() => productsQuery.data.value?.data || [])
const isProductsLoading = computed(() => productsQuery.isLoading.value)

// Actions
function handleCreateProduct() {
  router.push({
    name: 'product-create',
    query: { storeId: storeId.value }
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
</script>
