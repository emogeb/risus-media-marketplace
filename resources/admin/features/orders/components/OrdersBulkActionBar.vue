<template>
  <UiCard v-if="selectedCount > 0" padding="sm" class="mb-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700">
          Seçili: {{ selectedCount }}
        </span>
        <select
          v-model="selectedStatus"
          :disabled="!canUpdate || isPending"
          class="h-9 px-3 py-0 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <option value="">Durum seçin</option>
          <option value="pending">Beklemede</option>
          <option value="confirmed">Onaylandı</option>
          <option value="processing">İşleniyor</option>
          <option value="shipped">Kargoda</option>
          <option value="delivered">Teslim Edildi</option>
          <option value="cancelled">İptal</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <UiButton
          size="sm"
          variant="primary"
          :disabled="!canUpdate || !selectedStatus || isPending"
          @click="handleApply"
        >
          <span v-if="isPending">İşleniyor...</span>
          <span v-else>Uygula</span>
        </UiButton>
        <UiButton
          size="sm"
          variant="ghost"
          :disabled="isPending"
          @click="$emit('clear-selection')"
        >
          Temizle
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import type { OrderStatus } from '../types'

defineProps<{
  selectedCount: number
  canUpdate: boolean
  isPending?: boolean
}>()

const emit = defineEmits<{
  'apply-status': [status: OrderStatus]
  'clear-selection': []
}>()

const selectedStatus = ref<OrderStatus | ''>('')

function handleApply() {
  if (selectedStatus.value) {
    emit('apply-status', selectedStatus.value as OrderStatus)
    selectedStatus.value = ''
  }
}
</script>
