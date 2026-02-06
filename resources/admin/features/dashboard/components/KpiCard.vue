<template>
  <UiCard class="group cursor-default">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-500 mb-3">{{ label }}</p>
        <p
          :class="[
            format === 'currency' ? 'text-2xl' : 'text-3xl',
            'tracking-tight mb-2',
            hasValidValue ? 'font-semibold text-gray-900' : 'font-medium text-gray-400',
          ]"
        >
          {{ formattedValue }}
        </p>
        <div v-if="hasValidValue && growth !== undefined && !isInvalidNumber(growth)" class="flex items-center gap-1.5">
          <span :class="growth >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ growth >= 0 ? '↑' : '↓' }} {{ Math.abs(growth as number) }}%
          </span>
          <span class="text-xs text-gray-500">{{ $t('dashboard.kpi.growthLabel') }}</span>
        </div>
        <p v-else-if="!hasValidValue" class="text-xs text-gray-400">{{ $t('dashboard.kpi.noData') }}</p>
      </div>
      <div
        :class="[
          'text-3xl transition-opacity duration-300 ml-4',
          hasValidValue ? 'opacity-70 group-hover:opacity-90' : 'opacity-40',
        ]"
      >
        {{ icon }}
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import { formatCurrency, formatNumber } from '@admin/lib/format'

const props = defineProps<{
  label: string
  value: number | null | undefined
  icon: string
  growth?: number
  format?: 'currency' | 'number'
  hasData?: boolean
}>()

// Helper function to check if a number is invalid (NaN, Infinity, null, undefined)
function isInvalidNumber(value: number | null | undefined): boolean {
  if (value === null || value === undefined) {
    return true
  }
  if (typeof value !== 'number') {
    return true
  }
  return isNaN(value) || !isFinite(value)
}

// Check if we have valid data (summary exists AND value is valid)
const hasValidValue = computed(() => {
  // If hasData prop is explicitly false, return false
  if (props.hasData === false) {
    return false
  }
  // If hasData prop is true but value is invalid, return false
  if (props.hasData === true) {
    return !isInvalidNumber(props.value)
  }
  // If hasData is undefined, check value directly
  return !isInvalidNumber(props.value)
})

const formattedValue = computed(() => {
  // Guard: Always return "—" for invalid values
  if (isInvalidNumber(props.value)) {
    return '—'
  }
  
  // At this point, value is guaranteed to be a valid number
  const val = props.value as number
  
  // Format based on type
  if (props.format === 'currency') {
    return formatCurrency(val, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }
  return formatNumber(val)
})
</script>
