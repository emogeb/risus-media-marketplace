<template>
  <div class="space-y-6">
    <PageHeader title="Analitik" description="Satış ve performans analizleri" />
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <TopProductsChartCard />
      <FulfillmentSplitChartCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@admin/components/layout/PageHeader.vue'
import TopProductsChartCard from '@admin/features/analytics/components/TopProductsChartCard.vue'
import FulfillmentSplitChartCard from '@admin/features/analytics/components/FulfillmentSplitChartCard.vue'
</script>
