<template>
  <div
    class="rounded-2xl border border-gray-100/80 bg-white/70 backdrop-blur-sm shadow-sm p-5"
  >
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <!-- Left: Brand Header -->
      <div>
        <h2 class="text-2xl font-semibold text-gray-900 tracking-tight">
          {{ $t('dashboard.header.title') }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.header.subtitle') }}</p>
      </div>

      <!-- Right: Date Range + Quick Actions -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <!-- Date Range Dropdown -->
        <div class="relative">
          <label for="date-range" class="sr-only">Date range</label>
          <select
            id="date-range"
            v-model="selectedDateRange"
            class="h-9 px-4 py-0 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="today">{{ $t('dashboard.header.dateRange.today') }}</option>
            <option value="7d">{{ $t('dashboard.header.dateRange.last7Days') }}</option>
            <option value="30d">{{ $t('dashboard.header.dateRange.last30Days') }}</option>
            <option value="custom">{{ $t('dashboard.header.dateRange.custom') }}</option>
          </select>
        </div>

        <!-- Quick Actions -->
        <div class="flex gap-2">
          <router-link to="/orders">
            <UiButton size="sm" variant="primary" class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {{ $t('dashboard.header.quickActions.viewOrders') }}
            </UiButton>
          </router-link>
          <router-link to="/products">
            <UiButton size="sm" variant="secondary" class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ $t('dashboard.header.quickActions.newProduct') }}
            </UiButton>
          </router-link>
          <router-link to="/fulfillment">
            <UiButton size="sm" variant="ghost" class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {{ $t('dashboard.header.quickActions.fulfillmentQueue') }}
            </UiButton>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import UiButton from '@admin/components/ui/UiButton.vue'

const selectedDateRange = ref<string>('7d')
</script>
