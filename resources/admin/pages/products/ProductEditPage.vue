<template>
  <div class="space-y-6">
    <PageHeader title="Ürün Düzenle" description="Ürün bilgilerini güncelleyin" />
    
    <!-- Loading State -->
    <UiCard v-if="isLoading || storesQuery.isLoading.value">
      <div class="space-y-3">
        <UiSkeleton height="h-10" />
        <UiSkeleton height="h-10" />
        <UiSkeleton height="h-10" />
      </div>
    </UiCard>

    <!-- Error State -->
    <UiCard v-else-if="productQuery.error.value" class="p-6">
      <UiAlert
        variant="error"
        title="Hata"
        :message="(productQuery.error.value as any)?.response?.data?.error || (productQuery.error.value as any)?.message || 'Ürün yüklenirken bir hata oluştu.'"
      />
      <div class="mt-4">
        <UiButton @click="router.push({ name: 'products' })">Ürünler Listesine Dön</UiButton>
      </div>
    </UiCard>

    <!-- Form -->
    <ProductFormCard
      v-else-if="product && stores"
      :initial-data="formData"
      :stores="stores"
      :categories="categories"
      :errors="errors"
      :is-submitting="isSubmitting"
      :is-edit="true"
      @submit="handleSubmit"
      @cancel="router.push({ name: 'products' })"
    />

    <!-- Not Found -->
    <UiCard v-else class="p-6">
      <UiEmptyState
        title="Ürün bulunamadı"
        description="Aradığınız ürün mevcut değil veya silinmiş olabilir."
        action-label="Ürünler Listesine Dön"
        :action-to="{ name: 'products' }"
      />
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import ProductFormCard from './_components/ProductFormCard.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { useProductQuery } from '@admin/features/products/composables/useProductQuery'
import { getCategories } from '@admin/features/categories/api/categories.api'
import { useUpdateProduct } from '@admin/features/products/composables/useProductMutations'
import { required, numberMin } from '@admin/lib/forms/validators'
import type { ProductUpdateInput } from '@admin/features/products/api/products.api'

const route = useRoute()
const router = useRouter()

const productId = computed(() => {
  const id = route.params.id
  return id ? String(id) : ''
})
const productQuery = useProductQuery(() => productId.value)
const product = computed(() => productQuery.data.value?.data)
const isLoading = computed(() => productQuery.isLoading.value)

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

const formData = reactive<ProductUpdateInput>({})
const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)

const updateProductMutation = useUpdateProduct()

// Populate form when product data loads
watch(
  product,
  (newProduct) => {
    if (newProduct) {
      Object.assign(formData, {
        store_id: newProduct.store_id,
        title: newProduct.title || newProduct.name || '',
        sku: newProduct.sku || '',
        description: newProduct.description || '',
        price: newProduct.price,
        currency: newProduct.currency || 'TRY',
        stock: newProduct.stock,
        status: newProduct.status || 'draft',
        category: newProduct.category || '',
        discount_rate: newProduct.discount_rate || 0,
      })
    }
  },
  { immediate: true }
)

function validateForm(): boolean {
  errors.store_id = ''
  errors.title = ''
  errors.price = ''
  errors.stock = ''
  errors.status = ''

  if (formData.store_id !== undefined && (!formData.store_id || formData.store_id === 0)) {
    errors.store_id = 'Mağaza seçilmelidir'
  }

  if (formData.title !== undefined) {
    const titleValidation = required(formData.title)
    if (!titleValidation.valid) {
      errors.title = titleValidation.message || ''
    }
  }

  if (formData.price !== undefined && formData.price !== null) {
    const priceValidation = numberMin(formData.price, 0)
    if (!priceValidation.valid) {
      errors.price = priceValidation.message || ''
    }
  }

  if (formData.stock !== undefined && formData.stock !== null) {
    const stockValidation = numberMin(formData.stock, 0)
    if (!stockValidation.valid) {
      errors.stock = stockValidation.message || ''
    }
  }

  if (formData.status && !['draft', 'active', 'archived'].includes(formData.status)) {
    errors.status = 'Geçerli bir durum seçilmelidir'
  }

  return !errors.store_id && !errors.title && !errors.price && !errors.stock && !errors.status
}

async function handleSubmit(data: ProductUpdateInput) {
  Object.assign(formData, data)
  
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await updateProductMutation.mutateAsync({
      id: productId.value,
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
