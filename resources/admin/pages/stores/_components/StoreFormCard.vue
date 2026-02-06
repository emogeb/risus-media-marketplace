<template>
  <UiCard>
    <form @submit.prevent="$emit('submit', form)" class="space-y-6">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Mağaza Adı <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.name"
          type="text"
          :class="[
            'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            errors.name ? 'border-red-300' : 'border-gray-300',
          ]"
          placeholder="Örn: İstanbul Şubesi"
        />
        <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Kategori <span class="text-red-500">*</span>
        </label>
        <div 
          :class="[
            'border rounded-lg p-3 space-y-2',
            errors.category_ids ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50',
          ]"
        >
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="flex items-center"
          >
            <input
              :id="`category-${category.id}`"
              v-model="form.category_ids"
              type="checkbox"
              :value="category.id"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label 
              :for="`category-${category.id}`"
              class="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              {{ category.name }}
            </label>
          </div>
          <p v-if="!categories || categories.length === 0" class="text-sm text-gray-500 italic">
            Kategori bulunamadı
          </p>
        </div>
        <p class="mt-1 text-xs text-gray-500">Birden fazla kategori seçebilirsiniz</p>
        <p v-if="errors.category_ids" class="mt-1 text-xs text-red-600">{{ errors.category_ids }}</p>
      </div>

      <!-- Slug -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL)
        </label>
        <input
          v-model="form.slug"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="otomatik oluşturulacak"
        />
        <p class="mt-1 text-xs text-gray-500">Boş bırakılırsa mağaza adından otomatik oluşturulur</p>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mağaza sloganını veya mottosunu girin"
        />
      </div>

      <!-- Hero Video -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Ana Sayfa Videosu (Mağaza Videosu)
        </label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg relative overflow-hidden">
          <!-- Loading Overlay -->
          <div v-if="isSubmitting && selectedFileName" class="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center transition-opacity duration-300">
              <svg class="animate-spin h-10 w-10 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm font-bold text-blue-600 animate-pulse">Video Yükleniyor...</span>
              <span class="text-xs text-gray-500 mt-1">Lütfen bekleyiniz</span>
          </div>

          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex text-sm text-gray-600 justify-center">
              <label for="hero-video-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Video Yükle</span>
                <input id="hero-video-upload" name="hero-video-upload" type="file" class="sr-only" accept="video/mp4,video/quicktime,video/ogg" @change="handleFileChange" />
              </label>
              <p class="pl-1">veya sürükle bırak</p>
            </div>
            <p class="text-xs text-gray-500">
              MP4, MOV, QT (max 50MB)
            </p>
             <p v-if="selectedFileName" class="text-sm text-green-600 mt-2 font-semibold">
              Seçilen: {{ selectedFileName }}
            </p>
             <p v-if="(initialData as any)?.hero_video_url && !selectedFileName" class="text-sm text-blue-600 mt-2">
              Mevcut Video Yüklü
            </p>
          </div>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          v-model="form.email"
          type="email"
          :class="[
            'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            errors.email ? 'border-red-300' : 'border-gray-300',
          ]"
          placeholder="ornek@example.com"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          v-model="form.phone"
          type="tel"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+90 555 123 4567"
        />
      </div>

      <!-- Address -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Adres
        </label>
        <textarea
          v-model="form.address"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Mağaza adresi..."
        />
      </div>

      <!-- Logo URL -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Logo URL
        </label>
        <input
          v-model="form.logo_url"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/logo.png"
        />
      </div>

      <!-- Owner Info Section -->
      <div v-if="!isEdit" class="border rounded-lg p-4 bg-gray-50 space-y-4">
        <h3 class="font-medium text-gray-900 border-b pb-2">Mağaza Sahibi & Vergi Bilgileri</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Owner Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ad Soyad <span class="text-red-500">*</span></label>
                <input
                v-model="form.owner.name"
                type="text"
                :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', errors['owner.name'] ? 'border-red-300' : 'border-gray-300']"
                placeholder="Ad Soyad"
                />
                <p v-if="errors['owner.name']" class="mt-1 text-xs text-red-600">{{ errors['owner.name'] }}</p>
            </div>

            <!-- Owner Email -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">E-posta <span class="text-red-500">*</span></label>
                <input
                v-model="form.owner.email"
                type="email"
                :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', errors['owner.email'] ? 'border-red-300' : 'border-gray-300']"
                placeholder="sahip@example.com"
                />
                <p v-if="errors['owner.email']" class="mt-1 text-xs text-red-600">{{ errors['owner.email'] }}</p>
            </div>

            <!-- Company Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Şirket Ünvanı <span class="text-red-500">*</span></label>
                <input
                v-model="form.owner.company_name"
                type="text"
                :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', errors['owner.company_name'] ? 'border-red-300' : 'border-gray-300']"
                placeholder="ABC Ltd. Şti."
                />
                <p v-if="errors['owner.company_name']" class="mt-1 text-xs text-red-600">{{ errors['owner.company_name'] }}</p>
            </div>

            <!-- Tax Number -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası <span class="text-red-500">*</span></label>
                <input
                v-model="form.owner.tax_number"
                type="text"
                :class="['w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', errors['owner.tax_number'] ? 'border-red-300' : 'border-gray-300']"
                placeholder="1234567890"
                />
                <p v-if="errors['owner.tax_number']" class="mt-1 text-xs text-red-600">{{ errors['owner.tax_number'] }}</p>
            </div>
        </div>
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Durum <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.status"
          :class="[
            'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
            errors.status ? 'border-red-300' : 'border-gray-300',
          ]"
        >
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
        <p v-if="errors.status" class="mt-1 text-xs text-red-600">{{ errors.status }}</p>
      </div>

      <!-- Validation Errors Alert -->
      <UiAlert
        v-if="hasValidationErrors"
        variant="error"
        title="Doğrulama Hataları"
        :message="validationErrorMessage"
      />

      <!-- Form Actions -->
      <div class="flex items-center gap-4 pt-4 border-t">
        <UiButton type="submit" variant="primary" :disabled="isSubmitting">
          {{ isSubmitting ? (isEdit ? 'Güncelleniyor...' : 'Oluşturuluyor...') : (isEdit ? 'Güncelle' : 'Oluştur') }}
        </UiButton>
        <UiButton type="button" variant="ghost" @click="$emit('cancel')">
          İptal
        </UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import type { StoreCreateInput, StoreUpdateInput } from '@admin/features/stores/types'

const props = withDefaults(
  defineProps<{
    initialData?: StoreCreateInput | StoreUpdateInput
    errors?: Record<string, string>
    isSubmitting?: boolean
    isEdit?: boolean
    categories?: Array<{ id: number; name: string }>
  }>(),
  {
    isSubmitting: false,
    isEdit: false,
  }
)

const emit = defineEmits<{
  submit: [data: StoreCreateInput | StoreUpdateInput]
  cancel: []
}>()

const form = reactive<StoreCreateInput>({
  name: props.initialData?.name || '',
  category_ids: (props.initialData as StoreCreateInput)?.category_ids || [],
  slug: props.initialData?.slug || '',
  description: props.initialData?.description || '',
  email: props.initialData?.email || '',
  phone: props.initialData?.phone || '',
  address: props.initialData?.address || '',
  logo_url: props.initialData?.logo_url || '',
  status: props.initialData?.status || 'active',
  owner: (props.initialData as StoreCreateInput)?.owner || {
    name: '',
    email: '',
    company_name: '',
    tax_number: '',
  }
})

const errors = computed(() => props.errors || {})

const hasValidationErrors = computed(() => {
  return Object.keys(errors.value).length > 0
})

const validationErrorMessage = computed(() => {
  const errorMessages = Object.values(errors.value).filter(Boolean)
  return errorMessages.length > 0 ? errorMessages.join(', ') : ''
})

// Watch for external data changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(form, newData)
    }
  },
  { deep: true, immediate: true }
)

const selectedFileName = ref('')

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    selectedFileName.value = file.name
    form.hero_video = file
  }
}
</script>
