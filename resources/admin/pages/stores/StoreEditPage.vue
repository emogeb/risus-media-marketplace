<template>
  <div class="space-y-6">
    <PageHeader title="Mağaza Düzenle" description="Mağaza bilgilerini güncelleyin" />
    
    <!-- Loading State -->
    <UiCard v-if="isLoading">
      <div class="space-y-3">
        <UiSkeleton height="h-10" />
        <UiSkeleton height="h-10" />
        <UiSkeleton height="h-10" />
      </div>
    </UiCard>

    <!-- Error State -->
    <UiCard v-else-if="error" class="p-6">
      <UiAlert
        variant="error"
        title="Hata"
        :message="error?.response?.data?.message || error?.message || 'Mağaza yüklenirken bir hata oluştu. (' + (error?.response?.status || 'Bilinmeyen Hata') + ')'"
      />
      <div class="mt-4">
        <UiButton @click="router.push({ name: 'stores' })">Mağazalar Listesine Dön</UiButton>
      </div>
    </UiCard>

    <!-- Form -->
    <StoreFormCard
      v-else-if="store"
      :initial-data="formData"
      :errors="errors"
      :is-submitting="isSubmitting"
      :is-edit="true"
      :categories="categories"
      @submit="handleSubmit"
      @cancel="router.push({ name: 'stores' })"
    />

    <!-- Not Found -->
    <UiCard v-else class="p-6">
      <UiEmptyState
        title="Mağaza bulunamadı"
        description="Aradığınız mağaza mevcut değil veya silinmiş olabilir."
        action-label="Mağazalar Listesine Dön"
        :action-to="{ name: 'stores' }"
      />
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import StoreFormCard from './_components/StoreFormCard.vue'
import { useStoreQuery } from '@admin/features/stores/composables/useStoreQuery'
import { useUpdateStore } from '@admin/features/stores/composables/useStoreMutations'
import { useCategoriesQuery } from '@admin/features/categories/composables/useCategoriesQuery'
import { required, email as validateEmail } from '@admin/lib/forms/validators'
import type { StoreUpdateInput } from '@admin/features/stores/types'

const route = useRoute()
const router = useRouter()

const storeId = computed(() => String(route.params.id))
const storeQuery = useStoreQuery(() => storeId.value)
const store = computed(() => storeQuery.data.value?.data)
const isLoading = computed(() => storeQuery.isLoading.value)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const error = computed(() => storeQuery.error.value as any)

const { data: categories } = useCategoriesQuery()

const formData = reactive<StoreUpdateInput>({})
const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)

const updateStoreMutation = useUpdateStore()

// Populate form when store data loads
watch(
  store,
  (newStore) => {
    if (newStore) {
      Object.assign(formData, {
        name: newStore.name || '',
        slug: newStore.slug || '',
        category_ids: newStore.category_ids || [],
        description: newStore.description || '',
        email: newStore.email || '',
        phone: newStore.phone || '',
        address: newStore.address || '',
        logo_url: newStore.logo_url || '',
        status: newStore.status || 'active',
        bank_iban: newStore.bank_iban || '',
        bank_swiss_code: newStore.bank_swiss_code || '',
      })
    }
  },
  { immediate: true }
)

function validateForm(): boolean {
  errors.name = ''
  errors.email = ''
  errors.status = ''

  if (formData.name !== undefined) {
    const nameValidation = required(formData.name)
    if (!nameValidation.valid) {
      errors.name = nameValidation.message || ''
    }
  }

  if (formData.email) {
    const emailValidation = validateEmail(formData.email)
    if (!emailValidation.valid) {
      errors.email = emailValidation.message || ''
    }
  }

  if (formData.status && !['active', 'inactive'].includes(formData.status)) {
    errors.status = 'Geçerli bir durum seçilmelidir'
  }

  return !errors.name && !errors.email && !errors.status
}

async function handleSubmit(data: StoreUpdateInput) {
  Object.assign(formData, data)
  
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await updateStoreMutation.mutateAsync({
      id: Number(storeId.value),
      input: formData,
    })
  } catch (error: any) {
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const validationErrors = error.response.data.errors
      Object.keys(validationErrors).forEach((key) => {
        errors[key] = Array.isArray(validationErrors[key])
          ? validationErrors[key][0]
          : validationErrors[key]
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
