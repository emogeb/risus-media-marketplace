```html
<template>
  <UiCard padding="sm" class="bg-white border-gray-200 shadow-sm">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-black flex items-center gap-2">
          <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtrele
        </h3>
        <UiButton variant="ghost" size="sm" @click="clearFilters" class="text-gray-500 hover:text-red-500">
          Temizle
        </UiButton>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Status Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-black ml-1">Sipariş Durumu</label>
          <select
            v-model="localFilters.status"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option :value="undefined">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="confirmed">Onaylandı</option>
            <option value="processing">İşleniyor</option>
            <option value="shipped">Kargoda</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>

        <!-- Payment Status Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-black ml-1">Ödeme Durumu</label>
          <select
            v-model="localFilters.payment_status"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option :value="undefined">Tüm Ödeme Durumları</option>
            <option value="pending">Beklemede</option>
            <option value="paid">Ödendi</option>
            <option value="refunded">İade</option>
          </select>
        </div>

        <!-- Fulfillment Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-black ml-1">Sevkiyat Tipi</label>
          <select
            v-model="localFilters.fulfillment_type"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option :value="undefined">Tüm Sevkiyat Tipleri</option>
            <option value="shipping">Kargo</option>
            <option value="pickup">Mağazadan Al</option>
          </select>
        </div>

        <!-- Bridal Status Filter -->
        <div class="space-y-1.5">
          <label class="text-xs font-medium text-black ml-1">Süreç (Gelinlik)</label>
          <select
            v-model="localFilters.bridal_status"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option :value="undefined">Tüm Süreçler</option>
            <option value="new">Yeni</option>
            <option value="measurement_pending">Ölçü Bekleniyor</option>
            <option value="measurement_done">Ölçü Alındı</option>
            <option value="fitting_1_scheduled">1. Prova Planlandı</option>
            <option value="fitting_1_done">1. Prova Tamamlandı</option>
            <option value="alteration_in_progress">Tadilat Sürüyor</option>
            <option value="fitting_2_scheduled">2. Prova Planlandı</option>
            <option value="ready_for_pickup">Teslime Hazır</option>
            <option value="shipped">Kargoda</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end pt-2 border-t border-gray-100">
        <UiButton variant="primary" size="sm" @click="applyFilters" class="px-8">
          Filtreli Sonuçları Göster
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import type { OrdersQueryParams } from '../types'

const props = defineProps<{
  initialFilters?: OrdersQueryParams
}>()

const emit = defineEmits<{
  filtersChanged: [filters: OrdersQueryParams]
}>()

const localFilters = ref<OrdersQueryParams>({
  status: props.initialFilters?.status,
  payment_status: props.initialFilters?.payment_status,
  fulfillment_type: props.initialFilters?.fulfillment_type,
  bridal_status: props.initialFilters?.bridalStatus || props.initialFilters?.bridal_status,
})

// Update local filters if props change (e.g. from Saved Views)
watch(() => props.initialFilters, (newVal) => {
  if (newVal) {
    localFilters.value = {
      status: newVal.status,
      payment_status: newVal.payment_status,
      fulfillment_type: newVal.fulfillment_type,
      bridal_status: newVal.bridalStatus || newVal.bridal_status,
    }
  }
}, { deep: true })

function applyFilters() {
  emit('filtersChanged', { ...localFilters.value })
}

function clearFilters() {
  localFilters.value = {
    status: undefined,
    payment_status: undefined,
    fulfillment_type: undefined,
    bridal_status: undefined,
  }
  emit('filtersChanged', {})
}
</script>
