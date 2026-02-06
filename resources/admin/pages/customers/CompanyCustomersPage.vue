<template>
  <div class="space-y-6">
    <PageHeader title="Şirket Müşterileri" description="Şirket müşteri bilgilerini görüntüleyin">
      <template #actions>
        <UiButton variant="primary" @click="handleNewCustomer">
          {{ $t('customers.create.button') }}
        </UiButton>
      </template>
    </PageHeader>
    <CustomersTableCard
      :customers="customers"
      :is-loading="isLoading"
      type="company"
      @customer-clicked="handleCustomerClick"
    />
    <CustomerDetailDrawer
      :is-open="selectedCustomer !== null"
      :customer="selectedCustomer || undefined"
      @close="selectedCustomer = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import CustomersTableCard from '@admin/features/customers/components/CustomersTableCard.vue'
import CustomerDetailDrawer from '@admin/features/customers/components/CustomerDetailDrawer.vue'
import { useCustomersQuery } from '@admin/features/customers/composables/useCustomersQuery'
import { useUrlTableState } from '@admin/composables/useUrlTableState'
import type { Customer } from '@admin/features/customers/types'

const selectedCustomerId = ref<string | null>(null)

// URL-synced table state
const { state: filters } = useUrlTableState<Record<string, any>>({}, {})

const { data: customersData, isLoading } = useCustomersQuery({
  type: 'company',
  ...filters.value,
})

const customers = computed(() => customersData.value?.data)

const selectedCustomer = computed(() => {
  if (!selectedCustomerId.value || !customers.value) return null
  return customers.value.find((c) => c.id === selectedCustomerId.value) || null
})

function handleCustomerClick(id: string) {
  selectedCustomerId.value = id
}

function handleNewCustomer() {
  // TODO: CreateCustomerDrawer will be implemented later
  // For now, just show a placeholder action
}
</script>
