<template>
  <UiCard>
    <div class="flex flex-wrap items-center gap-4">
      <!-- Search Input -->
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Mağaza adı, email veya telefon ile ara..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleSearchInput"
        />
      </div>

      <!-- Status Filter -->
      <div class="min-w-[150px]">
        <select
          v-model="localFilters.status"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="handleStatusChange"
        >
          <option value="">Tüm Durumlar</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
        </select>
      </div>

      <!-- Clear Filters Button -->
      <UiButton v-if="hasActiveFilters" variant="ghost" size="sm" @click="handleClearFilters">
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
  status: props.filters.status || '',
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
  localFilters.status = ''
  emit('clear-filters')
}

// Watch for external filter changes
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.search = newFilters.search || ''
    localFilters.status = newFilters.status || ''
  },
  { deep: true }
)
</script>
