<template>
  <div class="space-y-6">
    <PageHeader title="Yeni Mağaza" description="Yeni bir mağaza oluşturun" />
    <StoreFormCard
      :errors="errors"
      :is-submitting="isSubmitting"
      :categories="categories"
      @submit="handleSubmit"
      @cancel="router.push({ name: 'stores' })"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import StoreFormCard from './_components/StoreFormCard.vue'
import { useCreateStore } from '@admin/features/stores/composables/useStoreMutations'
import { useCategoriesQuery } from '@admin/features/categories/composables/useCategoriesQuery'
import { required, email as validateEmail } from '@admin/lib/forms/validators'
import type { StoreCreateInput } from '@admin/features/stores/types'

const router = useRouter()

const form = reactive<StoreCreateInput>({
  name: '',
  slug: '',
  category_ids: [],
  description: '',
  email: '',
  phone: '',
  address: '',
  logo_url: '',
  status: 'active',
  owner: {
    name: '',
    email: '',
    company_name: '',
    tax_number: '',
  },
})

const errors = reactive<Record<string, string>>({})
const isSubmitting = ref(false)


const createStoreMutation = useCreateStore()
const { data: categories } = useCategoriesQuery()

function validateForm(): boolean {
  errors.name = ''
  errors.email = ''
  errors.status = ''

  const nameValidation = required(form.name)
  if (!nameValidation.valid) {
    errors.name = nameValidation.message || ''
  }

  if (!form.category_ids || form.category_ids.length === 0) {
    errors.category_ids = 'En az bir kategori seçimi zorunludur'
  }

  // Owner Validation
  if (!form.owner.name) errors['owner.name'] = 'Mağaza sahibi adı zorunludur'
  if (!form.owner.email) errors['owner.email'] = 'Mağaza sahibi e-posta zorunludur'
  if (form.owner.email && !validateEmail(form.owner.email).valid) errors['owner.email'] = 'Geçerli bir e-posta giriniz'
  if (!form.owner.company_name) errors['owner.company_name'] = 'Şirket ünvanı zorunludur'
  if (!form.owner.tax_number) errors['owner.tax_number'] = 'Vergi numarası zorunludur'

  if (form.email) {
    const emailValidation = validateEmail(form.email)
    if (!emailValidation.valid) {
      errors.email = emailValidation.message || ''
    }
  }

  if (!form.status) {
    errors.status = 'Durum seçilmelidir'
  }
  
  // Check if any error exists key starting with owner or standard fields
  const hasErrors = Object.keys(errors).some(key => errors[key])
  return !hasErrors
}

async function handleSubmit(data: StoreCreateInput | Partial<StoreCreateInput>) {
  const formData = data as StoreCreateInput;
  
  // Deep copy/ensure array for category_ids to avoid reactivity issues
  if (formData.category_ids && Array.isArray(formData.category_ids)) {
      form.category_ids = [...formData.category_ids]
  }
  
  Object.assign(form, formData)
  
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await createStoreMutation.mutateAsync(form)
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
