<template>
  <div class="space-y-6">
    <PageHeader title="Yeni Ürün" description="Yeni bir ürün oluşturun" />
    
    <!-- Loading stores -->
    <UiCard v-if="storesQuery.isLoading.value">
      <div class="space-y-3">
        <UiSkeleton height="h-10" />
        <UiSkeleton height="h-10" />
      </div>
    </UiCard>

    <!-- Error loading stores -->
    <UiCard v-else-if="storesQuery.error.value" class="p-6">
      <UiAlert
        variant="error"
        title="Hata"
        :message="storesQuery.error.value.message || 'Mağazalar yüklenirken bir hata oluştu.'"
      />
    </UiCard>

    <!-- No stores -->
    <UiCard v-else-if="!stores || stores.length === 0" class="p-6">
      <UiEmptyState
        title="Mağaza bulunamadı"
        description="Ürün oluşturmak için önce bir mağaza oluşturmalısınız."
        action-label="Yeni Mağaza Oluştur"
        :action-to="{ name: 'store-create' }"
      />
    </UiCard>

    <!-- Form -->
    <ProductFormCard
      v-else
      :stores="stores"
      :categories="categories"
      :errors="errors"
      :is-submitting="isSubmitting"
      @submit="handleSubmit"
      @cancel="router.push({ name: 'products' })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import ProductFormCard from './_components/ProductFormCard.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { useCreateProduct } from '@admin/features/products/composables/useProductMutations'
import { getCategories } from '@admin/features/categories/api/categories.api'
import { required, numberMin } from '@admin/lib/forms/validators'
import { useToast } from '@admin/composables/useToast'
import type { ProductCreateInput } from '@admin/features/products/api/products.api'

const router = useRouter()
const route = useRoute()
const { showSuccess } = useToast()

// Load stores and categories for dropdowns
const storesQuery = useStoresQuery({})
const stores = computed(() => storesQuery.data.value?.data || [])

const categories = ref<{ id: number; name: string; slug: string }[]>([])
onMounted(async () => {
  try {
    const res = await getCategories()
    categories.value = res.data || []
  } catch {
    categories.value = []
  }
})

const form = reactive<ProductCreateInput>({
  store_id: route.query.storeId ? Number(route.query.storeId) : 0,
  title: '',
  sku: '',
  description: '',
  price: 0,
  currency: 'TRY',
  stock: 0,
  status: 'draft',
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)

const createProductMutation = useCreateProduct()

function validateForm(): boolean {
  errors.store_id = ''
  errors.title = ''
  errors.price = ''
  errors.stock = ''
  errors.status = ''

  if (!form.store_id || form.store_id === 0) {
    errors.store_id = 'Mağaza seçilmelidir'
  }

  const titleValidation = required(form.title)
  if (!titleValidation.valid) {
    errors.title = titleValidation.message || ''
  }

  if (form.price === undefined || form.price === null) {
    errors.price = 'Fiyat girilmelidir'
  } else {
    const priceValidation = numberMin(form.price, 0)
    if (!priceValidation.valid) {
      errors.price = priceValidation.message || ''
    }
  }

  if (form.stock === undefined || form.stock === null) {
    errors.stock = 'Stok girilmelidir'
  } else {
    const stockValidation = numberMin(form.stock, 0)
    if (!stockValidation.valid) {
      errors.stock = stockValidation.message || ''
    }
  }

  if (!form.status) {
    errors.status = 'Durum seçilmelidir'
  }

  return !errors.store_id && !errors.title && !errors.price && !errors.stock && !errors.status
}

async function handleSubmit(formData: any) {
  Object.assign(form, formData)
  
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await createProductMutation.mutateAsync(form)
    showSuccess('Başarılı', 'Ürün oluşturuldu.')
    router.push({ name: 'products' })
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
