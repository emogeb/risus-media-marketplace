<template>
  <UiCard>
    <div v-if="props.sellerId" class="px-6 pt-6 pb-2">
      <UiBadge variant="info" class="text-xs">
        Filtre: Bu Satıcı
      </UiBadge>
    </div>

    <!-- Loading State -->
    <div v-if="props.isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 5" :key="i" height="h-12" />
    </div>

    <!-- Error State -->
    <div v-else-if="props.error" class="p-6">
      <UiAlert
        variant="error"
        title="Hata"
        :message="props.error.message || 'Ürünler yüklenirken bir hata oluştu.'"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!props.products || props.products.length === 0" class="p-6">
      <UiEmptyState
        :title="props.sellerId ? 'Bu satıcıya ait ürün bulunmuyor' : 'Henüz ürün yok'"
        :description="props.sellerId ? 'Bu satıcıya ait ürün bulunmuyor.' : 'Ürünler burada görünecek. İlk ürünü oluşturmak için butona tıklayın.'"
        action-label="Yeni Ürün"
        :action-to="{ name: 'product-create' }"
      />
    </div>

    <!-- Content -->
    <div v-else>
      <UiTable>
        <template #header>

          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasarımcı / Koleksiyon</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hazırlık</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
        </template>

        <template #body>
          <tr
            v-for="product in props.products"
            :key="product.id"
            class="hover:bg-gray-50/50 transition-colors duration-200"
          >


            <td class="px-6 py-4 text-sm">
              <div>
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ product.sku }}</p>
                <div v-if="product.requiresAppointment" class="mt-1">
                  <UiBadge variant="info" class="text-xs">Randevu Gerekli</UiBadge>
                </div>
              </div>
            </td>

            <td class="px-6 py-4 text-sm text-gray-600">
              <div>
                <p v-if="product.designer" class="font-medium">{{ product.designer }}</p>
                <p v-if="product.collection" class="text-xs text-gray-500 mt-0.5">{{ product.collection }}</p>
                <p v-if="!product.designer && !product.collection" class="text-gray-400">—</p>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <ProductAvailabilityBadge :availability="product.availability || 'in_stock'" />
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <span v-if="product.leadTimeDays !== undefined">{{ product.leadTimeDays }} gün</span>
              <span v-else class="text-gray-400">—</span>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatCurrency(product.price) }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ product.stock }}</span>
                <LowStockBadge :stock="product.stock" :threshold="product.lowStockThreshold" />
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center gap-2">
                <UiButton size="sm" variant="ghost" @click="$emit('view-detail', product.id)">
                  Detay
                </UiButton>

                <UiButton
                  size="sm"
                  variant="ghost"
                  :disabled="!canUpdate"
                  @click="$emit('edit-product', product.id)"
                >
                  Düzenle
                </UiButton>

                <UiButton
                  size="sm"
                  variant="ghost"
                  :disabled="!canUpdate"
                  :title="!canUpdate ? 'Stok düzenleme yetkiniz yok' : ''"
                  @click="$emit('edit-stock', product.id)"
                >
                  Stok
                </UiButton>
              </div>
            </td>
          </tr>
        </template>
      </UiTable>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiTable from '@admin/components/ui/UiTable.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import LowStockBadge from './LowStockBadge.vue'
import ProductAvailabilityBadge from './ProductAvailabilityBadge.vue'
import { formatCurrency } from '@admin/lib/format'
import { useAuthStore } from '@admin/stores/auth'
import { useBulkSelection } from '@admin/lib/tables/useBulkSelection'
import type { Product } from '../types'

const props = withDefaults(
  defineProps<{
    products?: Product[]
    isLoading: boolean
    error?: Error | null
    sellerId?: string
  }>(),
  {
    sellerId: undefined,
  }
)

const emit = defineEmits<{
  'edit-stock': [id: string]
  'edit-product': [id: string]
  'view-detail': [id: string]
  'selection-change': [ids: string[]]
}>()

const authStore = useAuthStore()
const canUpdate = computed(() => authStore.hasPermission('products.update'))

const bulkSelection = useBulkSelection()

watch(
  () => bulkSelection.selectedIdsArray.value,
  (ids) => {
    emit('selection-change', ids)
  }
)

const productIds = computed(() => props.products?.map((p) => p.id) || [])
const isAllSelected = computed(() => bulkSelection.areAllSelected(productIds.value))
const isIndeterminate = computed(() => bulkSelection.isIndeterminate(productIds.value))

function handleSelectAll() {
  if (!props.products) return
  bulkSelection.toggleAll(productIds.value)
}

function handleRowSelect(productId: string) {
  bulkSelection.toggle(productId)
}

defineExpose({
  selectedIds: bulkSelection.selectedIdsArray,
  clearSelection: bulkSelection.clear,
})
</script>