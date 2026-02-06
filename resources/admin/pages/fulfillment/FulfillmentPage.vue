<template>
  <div class="space-y-6">
    <PageHeader title="Sevkiyat" description="Sipariş sevkiyat süreçlerini yönetin" />
    <FulfillmentTabs />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@admin/components/layout/PageHeader.vue'
import FulfillmentTabs from '@admin/features/fulfillment/components/FulfillmentTabs.vue'
</script>
