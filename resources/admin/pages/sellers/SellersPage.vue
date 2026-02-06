<template>
  <div class="space-y-6">
    <PageHeader title="Satıcılar" description="Mağaza / satıcı yönetimi">
      <template #actions>
        <UiButton variant="primary" @click="isCreateDrawerOpen = true">
          {{ $t('sellers.create.button') }}
        </UiButton>
      </template>
    </PageHeader>
    <SellersFiltersBar :filters="filters" @filters-changed="handleFiltersChanged" @clear-filters="resetFilters" />
    <BulkActionBar
      :selected-ids="selectedIds"
      @clear="handleClearSelection"
    >
      <template #actions="{ selectedIds: ids, clear }">
        <UiButton
          v-if="canUpdate"
          variant="primary"
          size="sm"
          @click="handleBulkStatusChange(ids)"
        >
          {{ $t('bulkActions.sellers.changeStatus') }}
        </UiButton>
      </template>
    </BulkActionBar>
    <SellerIntegrationErrorCard
      v-if="hasIntegrationError"
      :endpoint="integrationErrorEndpoint"
      @retry="handleRetry"
    />
    <SellersTableCard
      v-else
      :sellers="sellers"
      :is-loading="isLoading"
      :error="error"
      @seller-clicked="handleSellerClick"
      @selection-change="selectedIds = $event"
    />
    <CreateSellerDrawer :is-open="isCreateDrawerOpen" @update:is-open="isCreateDrawerOpen = $event" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import BulkActionBar from '@admin/components/ui/BulkActionBar.vue'
import SellersFiltersBar from '@admin/features/sellers/components/SellersFiltersBar.vue'
import SellersTableCard from '@admin/features/sellers/components/SellersTableCard.vue'
import SellerIntegrationErrorCard from '@admin/features/sellers/components/SellerIntegrationErrorCard.vue'
import CreateSellerDrawer from '@admin/features/sellers/components/CreateSellerDrawer.vue'
import { useSellersQuery } from '@admin/features/sellers/composables/useSellersQuery'
import { useUrlTableState } from '@admin/composables/useUrlTableState'
import { useAuthStore } from '@admin/stores/auth'
import { useToast } from '@admin/composables/useToast'
import { isIntegrationError } from '@admin/lib/errors/integrationError'
import { apiBaseUrl } from '@admin/lib/integration'
import type { SellersQueryParams } from '@admin/features/sellers/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showInfo } = useToast()

const isCreateDrawerOpen = ref(false)
const selectedIds = ref<string[]>([])

const canUpdate = computed(() => authStore.hasPermission('sellers.update'))

// URL-synced table state
const { state: filters, setState: setFilters, resetState: resetFilters } = useUrlTableState<SellersQueryParams>(
  {},
  {
    q: { type: 'string' },
    search: { type: 'string' },
    status: { type: 'string' },
    page: { type: 'number' },
    pageSize: { type: 'number' },
  }
)

const sellersQuery = useSellersQuery(filters)
const sellersData = sellersQuery.data
const isLoading = sellersQuery.isLoading
const error = sellersQuery.error

const sellers = computed(() => sellersData.value?.data)

const hasIntegrationError = computed(() => {
  return error.value ? isIntegrationError(error.value) : false
})

const integrationErrorEndpoint = computed(() => {
  return `GET ${apiBaseUrl}/sellers`
})

function handleFiltersChanged(newFilters: SellersQueryParams) {
  setFilters(newFilters)
}

function handleSellerClick(id: string) {
  router.push({ name: 'seller-detail', params: { sellerId: id } })
}

function handleRetry() {
  sellersQuery.refetch()
}

function handleClearSelection() {
  selectedIds.value = []
}

function handleBulkStatusChange(ids: string[]) {
  showInfo(
    'API entegrasyonu bekleniyor',
    `${ids.length} satıcının durumu değiştirilecek`
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
