<template>
  <UiCard padding="sm">
    <div class="flex flex-wrap items-center gap-3">
      <label for="saved-views" class="text-xs font-medium text-gray-700">{{ $t('orders.savedViews.label') }}:</label>
      <select
        id="saved-views"
        v-model="selectedView"
        class="h-9 px-3 py-0 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        @change="handleViewChange"
      >
        <option value="">{{ $t('orders.savedViews.default') }}</option>
        <optgroup :label="$t('orders.savedViews.presetsLabel')">
          <option value="today_fittings">{{ $t('orders.savedViews.presets.todayFittings') }}</option>
          <option value="due_7_days">{{ $t('orders.savedViews.presets.due7Days') }}</option>
          <option value="overdue">{{ $t('orders.savedViews.presets.overdue') }}</option>
          <option value="measurement_pending">{{ $t('orders.savedViews.presets.measurementPending') }}</option>
        </optgroup>
        <optgroup v-if="customViews.length > 0" :label="$t('orders.savedViews.custom')">
          <option v-for="view in customViews" :key="view.id" :value="view.id">
            {{ view.name }}
          </option>
        </optgroup>
      </select>
      <UiButton
        v-if="hasActiveFilters"
        size="sm"
        variant="secondary"
        @click="handleSaveCurrentView"
      >
        {{ $t('orders.savedViews.saveCurrent') }}
      </UiButton>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { useToast } from '@admin/composables/useToast'
import type { OrdersQueryParams } from '../types'

const props = defineProps<{
  filters: OrdersQueryParams
}>()

const emit = defineEmits<{
  'view-selected': [filters: OrdersQueryParams]
}>()

const { showSuccess, showError } = useToast()
const selectedView = ref<string>('')
const customViews = ref<Array<{ id: string; name: string; filters: OrdersQueryParams }>>([])

const hasActiveFilters = computed(() => {
  return !!(
    props.filters.status ||
    props.filters.payment_status ||
    props.filters.fulfillment_type ||
    props.filters.from ||
    props.filters.to ||
    props.filters.bridalStatus
  )
})

// Load custom views from localStorage
onMounted(() => {
  try {
    const saved = localStorage.getItem('orders_saved_views')
    if (saved) {
      customViews.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load saved views:', error)
  }
})

// Preset view definitions
const presetViews: Record<string, OrdersQueryParams> = {
  today_fittings: {
    // Note: This would require client-side filtering in a real app
    // For now, we'll use bridalStatus as a proxy
    bridalStatus: 'fitting_1_scheduled',
  },
  due_7_days: {
    // Note: Client-side filtering would be needed for date calculations
    // This is a placeholder that would need backend support
  },
  overdue: {
    // Note: Client-side filtering would be needed
  },
  measurement_pending: {
    bridalStatus: 'measurement_pending',
  },
}

function handleViewChange() {
  if (!selectedView.value) {
    emit('view-selected', {})
    return
  }

  // Check if it's a preset view
  if (presetViews[selectedView.value]) {
    emit('view-selected', presetViews[selectedView.value])
    return
  }

  // Check if it's a custom view
  const customView = customViews.value.find((v) => v.id === selectedView.value)
  if (customView) {
    emit('view-selected', customView.filters)
  }
}

function handleSaveCurrentView() {
  const name = prompt('Görünüm adı:')
  if (!name || !name.trim()) return

  const newView = {
    id: `custom_${Date.now()}`,
    name: name.trim(),
    filters: { ...props.filters },
  }

  customViews.value.push(newView)

  try {
    localStorage.setItem('orders_saved_views', JSON.stringify(customViews.value))
    showSuccess('Görünüm kaydedildi')
    selectedView.value = newView.id
  } catch (error) {
    console.error('Failed to save view:', error)
    showError('Kaydetme başarısız', 'Görünüm kaydedilemedi.')
  }
}
</script>
