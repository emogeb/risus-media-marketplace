<template>
  <UiCard padding="sm" class="bg-white border-gray-200 shadow-sm">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-black flex items-center gap-2">
          <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Ürün Ara & Filtrele
        </h3>
        <UiButton variant="ghost" size="sm" @click="clearFilters" class="text-gray-500 hover:text-red-500">
          Temizle
        </UiButton>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <!-- Search Input -->
        <div class="space-y-1.5 lg:col-span-1">
          <label class="text-xs font-medium text-black ml-1">Arama</label>
          <input
            v-model="localFilters.q"
            type="text"
            placeholder="Ürün adı, SKU..."
            class="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
            @input="handleSearchInput"
          />
        </div>

        <!-- Store Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-black ml-1">Mağaza</label>
          <select
            v-model="localFilters.storeId"
            class="w-full h-9 px-3 py-0 text-sm border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tüm Mağazalar</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">
              {{ store.name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-black ml-1">Durum</label>
          <select
            v-model="localFilters.status"
            class="w-full h-9 px-3 py-0 text-sm border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Tüm Durumlar</option>
            <option value="draft">Taslak</option>
            <option value="active">Aktif</option>
            <option value="archived">Arşivlenmiş</option>
          </select>
        </div>

        <!-- Toggle Controls -->
        <div class="flex items-center gap-4 h-9 pb-2">
          <label class="flex items-center gap-2 cursor-pointer group">
            <input
              v-model="localFilters.lowStock"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-black group-hover:text-gray-900">Düşük Stok</span>
          </label>
          <UiButton size="sm" variant="primary" @click="applyFilters" class="ml-auto">
            Uygula
          </UiButton>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { debounce } from '@admin/lib/utils'
import type { ProductsQueryParams } from '../types'

const props = defineProps<{
  filters?: ProductsQueryParams
}>()

const emit = defineEmits<{
  'filters-changed': [filters: ProductsQueryParams]
  'clear-filters': []
}>()

// Load stores for filter dropdown
const { data: storesData } = useStoresQuery({})
const stores = computed(() => storesData.value?.data || [])

const localFilters = ref<ProductsQueryParams>({
  q: props.filters?.q || props.filters?.search,
  storeId: props.filters?.storeId,
  status: props.filters?.status,
  lowStock: props.filters?.lowStock ?? false,
  category: props.filters?.category,
  availability: props.filters?.availability,
  requiresAppointment: props.filters?.requiresAppointment ?? false,
})

// Debounced search
const debouncedEmit = debounce(() => {
  applyFilters()
}, 300)

function handleSearchInput() {
  debouncedEmit()
}

// Sync localFilters with props when filters change from outside (e.g., URL change)
watch(
  () => props.filters,
  (newFilters) => {
    if (newFilters) {
      localFilters.value = {
        q: newFilters.q || newFilters.search,
        storeId: newFilters.storeId,
        status: newFilters.status,
        lowStock: newFilters.lowStock ?? false,
        category: newFilters.category,
        availability: newFilters.availability,
        requiresAppointment: newFilters.requiresAppointment ?? false,
      }
    } else {
      localFilters.value = {
        lowStock: false,
        requiresAppointment: false,
      }
    }
  },
  { deep: true, immediate: true }
)

function applyFilters() {
  emit('filters-changed', { ...localFilters.value })
}

function clearFilters() {
  localFilters.value = {
    lowStock: false,
    requiresAppointment: false,
  }
  emit('clear-filters')
}
</script>
