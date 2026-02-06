```
<template>
  <UiModal :model-value="isOpen" @update:model-value="$emit('close')">
    <template #header>
      <h2 class="text-xl font-semibold text-black">Sipariş Detayı</h2>
    </template>
    <div v-if="isLoading" class="space-y-4">
      <UiSkeleton height="h-6" />
      <UiSkeleton height="h-6" />
      <UiSkeleton height="h-6" />
    </div>
    <div v-else-if="order" class="space-y-6">
      <!-- Temel Bilgiler -->
      <div>
        <h3 class="text-sm font-semibold text-black mb-3">Temel Bilgiler</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 mb-1">Sipariş No</p>
            <p class="text-sm font-medium text-black">{{ order.orderNumber }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Müşteri</p>
            <p class="text-sm font-medium text-black">{{ order.customerName }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ order.customerEmail }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Tutar</p>
            <p class="text-lg font-semibold text-black">{{ formatCurrency(order.total) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Durum</p>
            <BridalStatusBadge
              v-if="order.bridalStatus"
              :status="order.bridalStatus"
            />
            <OrderStatusBadge v-else :status="order.status" />
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Ödeme Durumu</p>
            <UiBadge :variant="order.paymentStatus === 'paid' ? 'success' : 'warning'">
              {{ order.paymentStatus === 'paid' ? 'Ödendi' : 'Beklemede' }}
            </UiBadge>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Sevkiyat Tipi</p>
            <p class="text-sm font-medium text-black">
              {{ order.fulfillmentType === 'shipping' ? 'Kargo' : 'Mağazadan Al' }}
            </p>
          </div>
          <div v-if="order.dueDate">
            <p class="text-xs text-gray-500 mb-1">Teslim Hedef Tarihi</p>
            <p class="text-sm font-medium text-black">{{ formatDate(order.dueDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Süreç (Timeline) -->
      <div v-if="order.bridalStatus">
        <h3 class="text-sm font-semibold text-black mb-3">Süreç</h3>
        <BridalTimeline :current-status="order.bridalStatus" />
      </div>

      <!-- Randevu -->
      <div>
        <h3 class="text-sm font-semibold text-black mb-3">Randevu</h3>
        <div v-if="order.appointment" class="space-y-3">
          <div v-if="order.appointment.date">
            <p class="text-xs text-gray-500 mb-1">Tarih</p>
            <p class="text-sm font-medium text-black">{{ formatDate(order.appointment.date) }}</p>
          </div>
          <div v-if="order.appointment.type">
            <p class="text-xs text-gray-500 mb-1">Tip</p>
            <p class="text-sm font-medium text-black">{{ formatAppointmentType(order.appointment.type) }}</p>
          </div>
          <div v-if="order.appointment.notes">
            <p class="text-xs text-gray-500 mb-1">Notlar</p>
            <p class="text-sm text-black">{{ order.appointment.notes }}</p>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg
            class="w-10 h-10 mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-xs text-center">Henüz randevu bilgisi yok</p>
        </div>
      </div>

      <!-- Ölçüler -->
      <div>
        <h3 class="text-sm font-semibold text-black mb-3">Ölçüler</h3>
        <div v-if="order.measurements" class="space-y-3">
          <div v-if="order.measurements.bust !== undefined" class="flex justify-between">
            <p class="text-xs text-gray-500">Göğüs</p>
            <p class="text-sm font-medium text-black">{{ order.measurements.bust }} cm</p>
          </div>
          <div v-if="order.measurements.waist !== undefined" class="flex justify-between">
            <p class="text-xs text-gray-500">Bel</p>
            <p class="text-sm font-medium text-black">{{ order.measurements.waist }} cm</p>
          </div>
          <div v-if="order.measurements.hip !== undefined" class="flex justify-between">
            <p class="text-xs text-gray-500">Kalça</p>
            <p class="text-sm font-medium text-black">{{ order.measurements.hip }} cm</p>
          </div>
          <div v-if="order.measurements.height !== undefined" class="flex justify-between">
            <p class="text-xs text-gray-500">Boy</p>
            <p class="text-sm font-medium text-black">{{ order.measurements.height }} cm</p>
          </div>
          <div v-if="order.measurements.notes" class="pt-2 border-t border-gray-200">
            <p class="text-xs text-gray-500 mb-1">Notlar</p>
            <p class="text-sm text-black">{{ order.measurements.notes }}</p>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
          <svg
            class="w-10 h-10 mb-2 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <p class="text-xs text-center">Henüz ölçü bilgisi yok</p>
        </div>
      </div>
    </div>
    <template #footer>
      <UiButton variant="ghost" @click="$emit('close')">Kapat</UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import UiModal from '@admin/components/ui/UiModal.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import OrderStatusBadge from './OrderStatusBadge.vue'
import BridalStatusBadge from './BridalStatusBadge.vue'
import BridalTimeline from './BridalTimeline.vue'
import DueDateBadge from './DueDateBadge.vue'
import { useOrderDetailQuery } from '../composables/useOrderDetailQuery'
import { formatCurrency, formatDate } from '@admin/lib/format'
import { isOverdue, isDueSoon } from '@admin/lib/date'

const props = defineProps<{
  isOpen: boolean
  orderId?: string
}>()

defineEmits<{
  close: []
}>()

const { data: order, isLoading } = useOrderDetailQuery(props.orderId || '')

function formatAppointmentType(type: 'measurement' | 'fitting_1' | 'fitting_2'): string {
  const typeMap = {
    measurement: 'Ölçü',
    fitting_1: '1. Prova',
    fitting_2: '2. Prova',
  }
  return typeMap[type] || type
}
</script>
