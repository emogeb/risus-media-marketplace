<template>
  <UiCard>
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 5" :key="i" height="h-12" />
    </div>
    <div v-else-if="sellers && sellers.length > 0">
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
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satıcı</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Şirket</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Sayısı</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Satış</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
        </template>
        <template #body>
          <tr
            v-for="seller in sellers"
            :key="seller.id"
            class="hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
            @click="$emit('seller-clicked', seller.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap" @click.stop>
              <input
                type="checkbox"
                :checked="bulkSelection.isSelected(seller.id)"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                @change="handleRowSelect(seller.id)"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ seller.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ seller.companyName || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ seller.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ seller.phone }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ seller.totalProducts }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(seller.totalSales) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UiBadge :variant="getStatusVariant(seller.status)">
                {{ getStatusLabel(seller.status) }}
              </UiBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center gap-2">
                <UiButton
                  size="sm"
                  variant="ghost"
                  @click.stop="handleViewProducts(seller.id)"
                >
                  Ürünleri Gör
                </UiButton>
                <UiButton
                  size="sm"
                  variant="ghost"
                  @click.stop="handleViewDetail(seller.id)"
                >
                  Detay
                </UiButton>
              </div>
            </td>
          </tr>
        </template>
      </UiTable>
    </div>
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg
        class="w-12 h-12 text-red-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">Hata</h4>
      <p class="text-sm text-gray-600 text-center max-w-sm">
        {{ error.message || 'Satıcılar yüklenirken bir hata oluştu.' }}
      </p>
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">Henüz satıcı yok</h4>
      <p class="text-sm text-gray-600 text-center max-w-sm">
        Satıcılar burada görünecek.
      </p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiTable from '@admin/components/ui/UiTable.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import { formatCurrency } from '@admin/lib/format'
import { useBulkSelection } from '@admin/lib/tables/useBulkSelection'
import type { Seller } from '../types'

const props = defineProps<{
  sellers?: Seller[]
  isLoading: boolean
  error?: Error | null
}>()

const emit = defineEmits<{
  'seller-clicked': [id: string]
  'selection-change': [ids: string[]]
}>()

const router = useRouter()

const bulkSelection = useBulkSelection()

// Sync selection changes to parent
watch(
  () => bulkSelection.selectedIdsArray.value,
  (ids) => {
    emit('selection-change', ids)
  }
)

const sellerIds = computed(() => props.sellers?.map((s) => s.id) || [])

const isAllSelected = computed(() => bulkSelection.areAllSelected(sellerIds.value))
const isIndeterminate = computed(() => bulkSelection.isIndeterminate(sellerIds.value))

function handleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement
  if (!props.sellers) return
  bulkSelection.toggleAll(sellerIds.value)
}

function handleRowSelect(sellerId: string) {
  bulkSelection.toggle(sellerId)
}

function handleViewProducts(sellerId: string) {
  router.push({ name: 'seller-products', params: { sellerId } })
}

function handleViewDetail(sellerId: string) {
  router.push({ name: 'seller-detail', params: { sellerId } })
}

function getStatusVariant(status: Seller['status']): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  const variants = {
    active: 'success',
    inactive: 'default',
    pending: 'warning',
  }
  return (variants[status] || 'default') as 'success' | 'warning' | 'danger' | 'info' | 'default'
}

function getStatusLabel(status: Seller['status']): string {
  const labels = {
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Beklemede',
  }
  return labels[status] || status
}

// Expose selection for parent component
defineExpose({
  selectedIds: bulkSelection.selectedIdsArray,
  clearSelection: bulkSelection.clear,
})
</script>
