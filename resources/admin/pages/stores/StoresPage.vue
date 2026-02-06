<template>
  <div class="space-y-6">
    <PageHeader title="Mağazalar" description="Mağaza yönetimi ve bilgileri">
      <template #actions>
        <UiButton variant="primary" @click="router.push({ name: 'store-create' })">
          Yeni Mağaza
        </UiButton>
      </template>
    </PageHeader>
    <StoresFiltersBar :filters="filters" @filters-changed="handleFiltersChanged" @clear-filters="resetFilters" />
    <StoresTableCard
      :stores="stores"
      :is-loading="isLoading"
      :error="error"
      :total="storesData?.total"
      :page="storesData?.page"
      :page-size="storesData?.pageSize"
      @store-clicked="handleStoreClick"
      @delete-store="handleDeleteStore"
      @page-change="handlePageChange"
    />

    <UiConfirmModal
      v-model="showDeleteModal"
      title="Mağazayı Sil"
      description="Bu mağazayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      confirm-text="Sil"
      cancel-text="İptal"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
      @update:model-value="onDeleteModalChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiConfirmModal from '@admin/components/ui/UiConfirmModal.vue'
import StoresFiltersBar from '@admin/features/stores/components/StoresFiltersBar.vue'
import StoresTableCard from '@admin/features/stores/components/StoresTableCard.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { useDeleteStore } from '@admin/features/stores/composables/useStoreMutations'
import { useUrlTableState } from '@admin/composables/useUrlTableState'
import { isIntegrationError } from '@admin/lib/errors/integrationError'
import { apiBaseUrl } from '@admin/lib/integration'
import type { StoresQueryParams } from '@admin/features/stores/composables/useStoresQuery'

const router = useRouter()

// URL-synced table state
const { state: filters, setState: setFilters, resetState: resetFilters } = useUrlTableState<StoresQueryParams>(
  {},
  {
    search: { type: 'string' },
    status: { type: 'string' },
    page: { type: 'number' },
    pageSize: { type: 'number' },
  }
)

const storesQuery = useStoresQuery(filters)
const storesData = storesQuery.data
const isLoading = storesQuery.isLoading
const error = storesQuery.error

const stores = computed(() => storesData.value?.data)

const hasIntegrationError = computed(() => {
  return error.value ? isIntegrationError(error.value) : false
})

const integrationErrorEndpoint = computed(() => {
  return `GET ${apiBaseUrl}/stores`
})

const deleteStoreMutation = useDeleteStore()
const showDeleteModal = ref(false)
const storeIdToDelete = ref<string | null>(null)

function handleFiltersChanged(newFilters: StoresQueryParams) {
  // Reset to page 1 when search/filters change
  setFilters({ ...newFilters, page: 1 })
}

function handlePageChange(page: number) {
  setFilters({ ...filters.value, page })
}

function handleStoreClick(id: string) {
  router.push({ name: 'store-detail', params: { id } })
}

function handleDeleteStore(id: string) {
  storeIdToDelete.value = id
  showDeleteModal.value = true
}

function onDeleteModalChange(open: boolean) {
  if (!open) storeIdToDelete.value = null
}

function closeDeleteModal() {
  showDeleteModal.value = false
  storeIdToDelete.value = null
}

function confirmDelete() {
  console.log('StoresPage: confirmDelete called', storeIdToDelete.value)
  if (storeIdToDelete.value) {
    deleteStoreMutation.mutate(storeIdToDelete.value, {
      onSuccess: () => {
        console.log('StoresPage: deleteStoreMutation success')
      },
      onError: (err) => {
        console.error('StoresPage: deleteStoreMutation error', err)
      }
    })
    closeDeleteModal()
  } else {
    console.warn('StoresPage: No storeIdToDelete found')
  }
}
</script>
