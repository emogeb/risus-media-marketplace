<template>
  <UiCard>
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 5" :key="i" height="h-12" />
    </div>
    <div v-else-if="customers && customers.length > 0">
      <UiTable>
        <template #header>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            {{ type === 'company' ? 'Şirket Adı' : 'Müşteri' }}
          </th>
          <th v-if="type === 'company'" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Vergi No
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Sipariş</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Harcama</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
        </template>
        <template #body>
          <tr
            v-for="customer in customers"
            :key="customer.id"
            class="hover:bg-gray-50 cursor-pointer"
            @click="$emit('customer-clicked', customer.id)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ customer.name }}
            </td>
            <td v-if="type === 'company'" class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ customer.type === 'company' ? customer.taxNumber || '—' : '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ customer.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ customer.phone }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ customer.totalOrders }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(customer.totalSpent) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <UiButton size="sm" variant="ghost" @click.stop="$emit('customer-clicked', customer.id)">
                Detay
              </UiButton>
            </td>
          </tr>
        </template>
      </UiTable>
    </div>
    <div v-else class="flex flex-col items-center justify-center py-12 text-gray-500">
      <svg
        class="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">
        {{ type === 'company' ? 'Şirket müşterisi bulunmuyor' : 'Bireysel müşteri bulunmuyor' }}
      </h4>
      <p class="text-sm text-gray-600 text-center max-w-sm">
        {{ type === 'company' ? 'Şirket müşterileri burada görünecek.' : 'Bireysel müşteriler burada görünecek.' }}
      </p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '@admin/components/ui/UiCard.vue'
import UiTable from '@admin/components/ui/UiTable.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { formatCurrency } from '@admin/lib/format'
import type { Customer, CustomerType } from '../types'

withDefaults(
  defineProps<{
    customers?: Customer[]
    isLoading: boolean
    type?: CustomerType
  }>(),
  {
    type: undefined,
  }
)

defineEmits<{
  'customer-clicked': [id: string]
}>()
</script>
