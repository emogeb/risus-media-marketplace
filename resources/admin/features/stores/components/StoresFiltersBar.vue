<template>
  <UiCard>
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <!-- Search Input -->
      <div class="flex-1">
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Mağaza adı, email veya telefon ile ara..."
          class="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          @input="handleSearchInput"
        />
      </div>

      <!-- Status Filter -->
      <div class="w-full sm:w-48">
        <select
          v-model="localFilters.status"
          class="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          @change="handleStatusChange"
        >
          <option value="">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <UiButton v-if="hasActiveFilters" variant="ghost" size="sm" class="h-10 sm:h-9" @click="handleClearFilters">
        Filtreleri Temizle
      </UiButton>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { debounce } from '@admin/lib/utils'
import type { StoresQueryParams } from '../composables/useStoresQuery'

const props = defineProps<{
  filters: StoresQueryParams
}>()

const emit = defineEmits<{
  'filters-changed': [filters: StoresQueryParams]
  'clear-filters': []
}>()

const localFilters = reactive<StoresQueryParams>({
  search: props.filters.search || '',
  status: props.filters.status,
})

const hasActiveFilters = computed(() => {
  return !!(localFilters.search || localFilters.status)
})

// Debounced search
const debouncedEmit = debounce(() => {
  emit('filters-changed', { ...localFilters })
}, 300)

function handleSearchInput() {
  debouncedEmit()
}

function handleStatusChange() {
  emit('filters-changed', { ...localFilters })
}

function handleClearFilters() {
  localFilters.search = ''
  localFilters.status = undefined
  emit('clear-filters')
}

// Watch for external filter changes
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.search = newFilters.search || ''
    localFilters.status = newFilters.status
  },
  { deep: true }
)
</script>
