<template>
  <UiCard padding="sm">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <div class="flex-1">
        <input
          v-model="localFilters.q"
          type="text"
          placeholder="Satıcı ara..."
          class="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleSearchInput"
        />
      </div>
      <div class="flex items-center gap-2">
        <label for="status-filter" class="text-xs text-gray-500 whitespace-nowrap">Durum:</label>
        <select
          id="status-filter"
          v-model="localFilters.status"
          class="w-full sm:w-auto h-10 px-3 py-0 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="undefined">Tümü</option>
          <option value="active">Aktif</option>
          <option value="inactive">Pasif</option>
          <option value="pending">Beklemede</option>
        </select>
      </div>
      <div class="flex gap-2">
        <UiButton size="sm" class="flex-1 sm:flex-none h-10 sm:h-9" @click="applyFilters">Filtrele</UiButton>
        <UiButton size="sm" variant="ghost" class="flex-1 sm:flex-none h-10 sm:h-9" @click="clearFilters">Temizle</UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import type { SellersQueryParams } from '../types'

const props = defineProps<{
  filters?: SellersQueryParams
}>()

const emit = defineEmits<{
  filtersChanged: [filters: SellersQueryParams]
  clearFilters: []
}>()

const localFilters = ref<SellersQueryParams>({
  q: props.filters?.q || props.filters?.search,
  status: props.filters?.status,
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

function handleSearchInput() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Sync localFilters with props when filters change from outside (e.g., URL change)
watch(
  () => props.filters,
  (newFilters) => {
    if (newFilters) {
      localFilters.value = {
        q: newFilters.q || newFilters.search,
        status: newFilters.status,
      }
    } else {
      localFilters.value = {}
    }
  },
  { deep: true, immediate: true }
)

function applyFilters() {
  emit('filtersChanged', { ...localFilters.value })
}

function clearFilters() {
  localFilters.value = {}
  emit('clearFilters')
}
</script>
