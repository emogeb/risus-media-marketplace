<template>
  <UiCard>
    <form @submit.prevent="$emit('submit', form)" class="space-y-6">
      <!-- ====== BASIC INFORMATION (Always Visible) ====== -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900">Temel Bilgiler</h3>
        
        <!-- Store Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Mağaza <span class="text-red-500">*</span>
          </label>
          <select
            v-model.number="form.store_id"
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.store_id ? 'border-red-300' : 'border-gray-300',
            ]"
            :disabled="!stores || stores.length === 0"
          >
            <option :value="0">Mağaza seçiniz...</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
          <p v-if="errors.store_id" class="mt-1 text-xs text-red-600">{{ errors.store_id }}</p>
        </div>

        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Ürün Başlığı <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
              errors.title ? 'border-red-300' : 'border-gray-300',
            ]"
            placeholder="Örn: Klasik Beyaz Gelinlik"
          />
          <p v-if="errors.title" class="mt-1 text-xs text-red-600">{{ errors.title }}</p>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            v-model="form.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kategori seçiniz...</option>
            <template v-if="categories && categories.length > 0">
              <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
                {{ cat.name }}
              </option>
            </template>
            <template v-else>
              <option value="gelinlik">Gelinlik</option>
              <option value="damatlik">Damatlık</option>
              <option value="abiye">Abiye</option>
            </template>
          </select>
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
            <option value="draft">Taslak</option>
            <option value="active">Aktif</option>
            <option value="archived">Arşivlenmiş</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-xs text-red-600">{{ errors.status }}</p>
        </div>
      </div>

      <!-- ====== PRICING SECTION (Collapsible) ====== -->
      <UiCollapsibleSection title="Fiyatlandırma" :default-open="true">
        <div class="space-y-4">
          <!-- List Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Liste Fiyatı <span class="text-red-500">*</span>
            </label>
            <div class="flex items-center gap-2">
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                :class="[
                  'flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                  errors.price ? 'border-red-300' : 'border-gray-300',
                ]"
                placeholder="0.00"
              />
              <select
                v-model="form.currency"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TRY">TRY</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <p v-if="errors.price" class="mt-1 text-xs text-red-600">{{ errors.price }}</p>
          </div>

          <!-- Discount Rate Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              İndirim Oranı
            </label>
            <div class="flex flex-wrap gap-2 items-center">
              <button
                v-for="rate in availableRates"
                :key="rate"
                type="button"
                @click="form.discount_rate = rate"
                :class="[
                  'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                  form.discount_rate === rate
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
              >
                <span v-if="rate === 0">İndirimsiz</span>
                <span v-else>%{{ rate }}</span>
              </button>
              
              <!-- Custom Rate Input -->
              <div class="flex items-center gap-1 border border-gray-300 rounded-lg px-2 py-1 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ml-2">
                <span class="text-gray-500 text-sm">%</span>
                <input
                  v-model.number="customRate"
                  type="number"
                  min="0"
                  max="100"
                  class="w-12 outline-none text-sm bg-transparent"
                  placeholder="Özel"
                  @keyup.enter.prevent="addCustomRate"
                />
                <button
                  type="button"
                  @click="addCustomRate"
                  class="text-blue-600 hover:text-blue-800 font-bold px-1 text-sm disabled:opacity-50"
                  :disabled="!customRate"
                >
                  +Ekle
                </button>
              </div>
            </div>
            
            <!-- Calculated Selling Price -->
            <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
              <div>
                <span class="block text-sm font-medium text-gray-500">Satış Fiyatı</span>
                <span v-if="form.discount_rate && form.discount_rate > 0" class="text-xs text-green-600 font-medium">
                  %{{ form.discount_rate }} İndirim Uygulandı
                </span>
              </div>
              <div class="text-right">
                <span class="block text-2xl font-bold text-gray-900 tracking-tight">
                  {{ formatPrice(calculatedSellingPrice) }}
                </span>
                <span v-if="form.discount_rate && form.discount_rate > 0" class="text-xs text-gray-400 line-through">
                   {{ formatPrice(form.price) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </UiCollapsibleSection>

      <!-- ====== INVENTORY SECTION (Collapsible) ====== -->
      <UiCollapsibleSection title="Envanter ve Stok" :default-open="true">
        <div class="space-y-4">
          <!-- SKU -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <label class="block text-sm font-medium text-gray-700">
                SKU
              </label>
              <UiTooltip text="Stok Takip Kodu - Ürünü tanımlamak için benzersiz bir kod">
                <svg class="h-4 w-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </UiTooltip>
            </div>
            <input
              v-model="form.sku"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: GLN-001"
            />
            <p class="mt-1 text-xs text-gray-500">Boş bırakırsanız otomatik oluşturulur</p>
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Stok Miktarı <span class="text-red-500">*</span>
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                errors.stock ? 'border-red-300' : 'border-gray-300',
              ]"
              placeholder="0"
              :disabled="form.made_to_order"
            />
            <p v-if="errors.stock" class="mt-1 text-xs text-red-600">{{ errors.stock }}</p>
            <p v-if="form.made_to_order" class="mt-1 text-xs text-gray-500">Sipariş üzerine üretimde stok takibi yapılmaz</p>
          </div>

          <!-- Made to Order -->
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <label class="text-sm font-medium text-gray-700">Sipariş Üzerine Üretim</label>
                <UiTooltip text="Bu ürün siparişten sonra üretilecekse işaretleyin">
                  <svg class="h-4 w-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </UiTooltip>
              </div>
              <p class="text-xs text-gray-500 mt-1">Ürün hazır değil, sipariş sonrası hazırlanacak</p>
            </div>
            <UiToggle v-model="form.made_to_order" />
          </div>

          <!-- Lead Time (conditional) -->
          <div v-if="form.made_to_order" class="pl-4 border-l-2 border-blue-200">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Hazırlık Süresi (Gün)
            </label>
            <input
              v-model.number="form.lead_time_days"
              type="number"
              min="0"
              max="365"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: 14"
            />
            <p class="mt-1 text-xs text-gray-500">Ürünün hazırlanması için gereken gün sayısı</p>
          </div>
        </div>
      </UiCollapsibleSection>

      <!-- ====== DESCRIPTION SECTION (Collapsible) ====== -->
      <UiCollapsibleSection title="Açıklama" :default-open="true">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Ürün Açıklaması
          </label>
          <textarea
            v-model="form.description"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ürününüzü detaylı bir şekilde açıklayın..."
          />
          <div class="mt-1 flex items-center justify-between">
            <p class="text-xs text-gray-500">Müşterilerinize ürün hakkında bilgi verin</p>
            <p class="text-xs text-gray-400">{{ descriptionLength }} / 65535 karakter</p>
          </div>
        </div>
      </UiCollapsibleSection>

      <!-- ====== PHYSICAL PROPERTIES SECTION (Collapsible) ====== -->
      <UiCollapsibleSection title="Fiziksel Özellikler" :default-open="false">
        <div class="space-y-4">
          <p class="text-sm text-gray-600">Kargo ve lojistik için gerekli bilgiler</p>
          
          <!-- Dimensions Row -->
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Uzunluk (cm)
              </label>
              <input
                v-model.number="form.length"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Genişlik (cm)
              </label>
              <input
                v-model.number="form.width"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Yükseklik (cm)
              </label>
              <input
                v-model.number="form.height"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <!-- Weight -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ağırlık (kg)
            </label>
            <input
              v-model.number="form.weight"
              type="number"
              step="0.01"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            <p class="mt-1 text-xs text-gray-500">Kargo ücreti hesaplaması için</p>
          </div>
          
          <!-- Size Info -->
          <div>
            <div class="flex items-center gap-2 mb-1">
              <label class="block text-sm font-medium text-gray-700">
                Beden Bilgisi
              </label>
              <UiTooltip text="Ürünün uygun olduğu beden aralığı (örn: 36-44, S/M/L)">
                <svg class="h-4 w-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </UiTooltip>
            </div>
            <input
              v-model="form.size_info"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Örn: 36-44 arası, S/M/L/XL"
              maxlength="100"
            />
          </div>
          
          <!-- Volume Calculator (Bonus Feature) -->
          <div v-if="dimensionVolume" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span class="text-sm font-medium text-blue-800">Hacim: {{ dimensionVolume.toLocaleString('tr-TR') }} cm³</span>
              <span class="text-xs text-blue-600">({{ (dimensionVolume / 1000000).toFixed(3) }} m³)</span>
            </div>
          </div>
        </div>
      </UiCollapsibleSection>

      <!-- ====== MEDIA SECTION (Always Visible) ====== -->
      <UiCollapsibleSection title="Görseller" :default-open="true" badge="Yeni">
        <div class="space-y-4">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" @click="$refs.fileInput.click()">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            />
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              Görselleri seçmek için tıklayın veya sürükleyin
            </p>
            <p class="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 10MB)</p>
          </div>

          <!-- Preview List -->
          <div v-if="selectedFiles.length > 0" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div v-for="(file, index) in selectedFiles" :key="index" class="relative group">
              <div class="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img :src="getObjectUrl(file)" class="w-full h-full object-cover" :alt="`Preview ${index + 1}`" />
              </div>
              
              <!-- Primary Badge -->
              <div v-if="index === 0" class="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded shadow-lg">
                Ana Görsel
              </div>
              
              <!-- Delete Button -->
              <button
                type="button"
                @click="removeFile(index)"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                title="Görseli Sil"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Image Count -->
              <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                {{ index + 1 }} / {{ selectedFiles.length }}
              </div>
            </div>
          </div>

          <p v-if="selectedFiles.length > 0" class="text-xs text-gray-500">
            💡 İlk görsel ürün ana görseli olarak kullanılacaktır. Sıralamayı değiştirmek için görselleri yeniden yükleyin.
          </p>
        </div>
      </UiCollapsibleSection>

      <!-- Validation Errors Alert -->
      <UiAlert
        v-if="hasValidationErrors"
        variant="error"
        title="Doğrulama Hataları"
        :message="validationErrorMessage"
      />

      <!-- Form Actions -->
      <div class="flex items-center gap-4 pt-4 border-t">
        <UiButton type="submit" variant="primary" :disabled="isSubmitting || !stores || stores.length === 0">
          {{ isSubmitting ? (isEdit ? 'Güncelleniyor...' : 'Oluşturuluyor...') : (isEdit ? 'Ürünü Güncelle' : 'Ürün Oluştur') }}
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
import UiCollapsibleSection from '@admin/components/ui/UiCollapsibleSection.vue'
import UiToggle from '@admin/components/ui/UiToggle.vue'
import UiTooltip from '@admin/components/ui/UiTooltip.vue'
import type { ProductCreateInput } from '@admin/features/products/api/products.api'
import type { Store } from '@admin/features/stores/types'

interface CategoryOption {
  id: number
  name: string
  slug: string
}

const props = withDefaults(
  defineProps<{
    initialData?: ProductCreateInput | Partial<ProductCreateInput>
    errors?: Record<string, string>
    isSubmitting?: boolean
    isEdit?: boolean
    stores?: Store[]
    categories?: CategoryOption[]
  }>(),
  {
    isSubmitting: false,
    isEdit: false,
  }
)

const emit = defineEmits<{
  submit: [data: ProductCreateInput | Partial<ProductCreateInput>]
  cancel: []
}>()

const form = reactive<ProductCreateInput | Partial<ProductCreateInput>>({
  store_id: props.initialData?.store_id || 0,
  title: props.initialData?.title || '',
  sku: props.initialData?.sku || '',
  description: props.initialData?.description || '',
  price: props.initialData?.price ?? 0,
  discount_rate: props.initialData?.discount_rate || 0,
  currency: props.initialData?.currency || 'TRY',
  stock: props.initialData?.stock ?? 0,
  status: props.initialData?.status || 'draft',
  category: (props.initialData as any)?.category || '',
  made_to_order: props.initialData?.made_to_order || false,
  lead_time_days: props.initialData?.lead_time_days,
  length: props.initialData?.length,
  width: props.initialData?.width,
  height: props.initialData?.height,
  weight: props.initialData?.weight,
  size_info: props.initialData?.size_info || '',
})

const errors = computed(() => props.errors || {})

const hasValidationErrors = computed(() => {
  return Object.keys(errors.value).length > 0
})

const validationErrorMessage = computed(() => {
  const errorMessages = Object.values(errors.value).filter(Boolean)
  return errorMessages.length > 0 ? errorMessages.join(', ') : ''
})

const descriptionLength = computed(() => {
  return form.description?.length || 0
})

const availableRates = ref([0, 10, 15, 20, 25, 30, 40, 50, 70])
const customRate = ref<number | null>(null)

const calculatedSellingPrice = computed(() => {
  const price = form.price || 0
  const rate = form.discount_rate || 0
  
  if (rate <= 0) return price
  return price * (1 - (rate / 100))
})

function addCustomRate() {
  if (customRate.value && customRate.value > 0 && customRate.value <= 100) {
    const rate = customRate.value
    if (!availableRates.value.includes(rate)) {
      availableRates.value.push(rate)
      availableRates.value.sort((a, b) => a - b)
    }
    form.discount_rate = rate
    customRate.value = null
  }
}


// Watch for external data changes
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.assign(form, {
        ...newData,
        category: (newData as any)?.category || '',
      })
    }
  },
  { deep: true, immediate: true }
)

// Watch made_to_order to reset stock if enabled
watch(
  () => form.made_to_order,
  (newValue) => {
    if (newValue) {
      form.stock = 0
    }
  }
)

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = [...selectedFiles.value, ...Array.from(target.files)]
    ;(form as any).images = selectedFiles.value
  }
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
  ;(form as any).images = selectedFiles.value
}

function getObjectUrl(file: File) {
  return URL.createObjectURL(file)
}

const dimensionVolume = computed(() => {
  if (form.length && form.width && form.height) {
    return Math.round(form.length * form.width * form.height)
  }
  return null
})

function formatPrice(price: number | undefined) {
  if (!price) return '0'
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: form.currency || 'TRY',
  }).format(price)
}
</script>
