<template>
  <div class="space-y-6">
    <PageHeader title="Mağaza Ayarları" description="Mağaza bilgilerini düzenleyin" />

    <!-- Store Selector -->
    <UiCard>
      <StoreSelector
        :stores="stores"
        :is-loading="isStoresLoading"
        :error="storesError"
        :selected-store-id="selectedStoreId"
        @select="handleStoreSelect"
        @view-store="handleViewStore"
      />
    </UiCard>

    <!-- Store Form -->
    <div v-if="selectedStoreId" class="space-y-6">
      <!-- Loading State -->
      <UiCard v-if="isStoreLoading">
        <div class="space-y-4">
          <UiSkeleton height="h-10" />
          <UiSkeleton height="h-10" />
          <UiSkeleton height="h-20" />
          <UiSkeleton height="h-10" />
        </div>
      </UiCard>

      <!-- Form -->
      <div v-else-if="selectedStore">
        <StoreFormCard
          :initial-data="formData"
          :errors="updateErrors"
          :is-submitting="isUpdating"
          :is-edit="true"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <!-- Empty State - No Store Selected -->
    <UiCard v-else padding="lg">
      <div class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">Mağaza Seçiniz</h3>
        <p class="mt-2 text-sm text-gray-500">
          Düzenlemek istediğiniz mağazayı yukarıdan seçin.
        </p>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import StoreSelector from '@admin/features/stores/components/StoreSelector.vue'
import StoreFormCard from '@admin/pages/stores/_components/StoreFormCard.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { useStoreQuery } from '@admin/features/stores/composables/useStoreQuery'
import { useUpdateStore } from '@admin/features/stores/composables/useStoreMutations'
import { toastService } from '@admin/composables/useToast'
import type { StoreUpdateInput } from '@admin/features/stores/types'

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

// Form Data
const formData = computed<StoreUpdateInput | undefined>(() => {
  if (!selectedStore.value) return undefined
  return {
    name: selectedStore.value.name,
    slug: selectedStore.value.slug,
    description: selectedStore.value.description || '',
    email: selectedStore.value.email || '',
    phone: selectedStore.value.phone || '',
    address: selectedStore.value.address || '',
    logo_url: selectedStore.value.logo_url || '',
    status: selectedStore.value.status,
  }
})

// Update Mutation
const updateMutation = useUpdateStore()
const isUpdating = computed(() => updateMutation.isPending.value)
const updateErrors = ref<Record<string, string>>({})

// Actions
function handleStoreSelect(storeId: number) {
  selectedStoreId.value = String(storeId)
  updateErrors.value = {}
}

function handleViewStore(storeId: number) {
  router.push({ name: 'store-detail', params: { id: String(storeId) } })
}

function handleSubmit(data: StoreUpdateInput) {
  if (!selectedStoreId.value) return

  updateErrors.value = {}
  updateMutation.mutate(
    { id: Number(selectedStoreId.value), input: data },
    {
      onSuccess: () => {
        toastService.showSuccess('Başarılı', 'Mağaza başarıyla güncellendi')
        storeQuery.refetch()
        storesQuery.refetch()
      },
      onError: (error: any) => {
        console.error('Update store error:', error)
        if (error.response?.data?.errors) {
          updateErrors.value = error.response.data.errors
        }
        toastService.showError('Hata', error.response?.data?.message || 'Mağaza güncellenirken bir hata oluştu')
      }
    }
  )
}

function handleCancel() {
  router.push({ name: 'stores' })
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
