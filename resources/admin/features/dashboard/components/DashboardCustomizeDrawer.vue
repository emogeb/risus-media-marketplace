<template>
  <UiDrawer :model-value="isOpen" @update:model-value="close">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.customize.title') }}
        </h2>
        <button
          class="text-gray-400 hover:text-gray-600 transition-colors"
          @click="close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Widget List -->
      <div class="space-y-2">
        <div
          v-for="(widgetId, index) in orderedWidgets"
          :key="widgetId"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
        >
          <!-- Toggle Switch -->
          <div class="flex-shrink-0">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="preferencesStore.enabled[widgetId]"
                class="sr-only peer"
                @change="preferencesStore.toggle(widgetId)"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              />
            </label>
          </div>

          <!-- Widget Info -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900">
              {{ $t(getWidget(widgetId)?.titleKey || '') }}
            </div>
            <div class="text-xs text-gray-500 mt-0.5">
              {{ $t(getWidget(widgetId)?.descriptionKey || '') }}
            </div>
          </div>

          <!-- Move Buttons (only for enabled widgets) -->
          <div v-if="preferencesStore.enabled[widgetId]" class="flex-shrink-0 flex flex-col gap-1">
            <button
              :disabled="!canMoveUp(widgetId)"
              :class="[
                'p-1 rounded text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
              ]"
              @click="preferencesStore.move(widgetId, 'up')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              :disabled="!canMoveDown(widgetId)"
              :class="[
                'p-1 rounded text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
              ]"
              @click="preferencesStore.move(widgetId, 'down')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between gap-3">
        <UiButton variant="ghost" size="sm" @click="preferencesStore.resetDefaults()">
          {{ $t('dashboard.customize.resetDefaults') }}
        </UiButton>
        <UiButton variant="primary" size="sm" @click="close">
          {{ $t('dashboard.customize.close') }}
        </UiButton>
      </div>
    </template>
  </UiDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDashboardPreferencesStore } from '@admin/stores/dashboardPreferences'
import { DASHBOARD_WIDGETS, type DashboardWidgetId } from '@admin/features/dashboard/widgets/registry'
import UiDrawer from '@admin/components/ui/UiDrawer.vue'
import UiButton from '@admin/components/ui/UiButton.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const preferencesStore = useDashboardPreferencesStore()

function close(): void {
  emit('update:isOpen', false)
}

const orderedWidgets = computed(() => {
  // Show all widgets in the order they appear, including disabled ones
  // First show enabled widgets in their order, then disabled widgets
  const enabled = preferencesStore.order.filter((id) => preferencesStore.enabled[id])
  const disabled = DASHBOARD_WIDGETS.map((w) => w.id).filter(
    (id) => !preferencesStore.enabled[id]
  )
  return [...enabled, ...disabled]
})

function getWidget(id: DashboardWidgetId) {
  return DASHBOARD_WIDGETS.find((w) => w.id === id)
}

function canMoveUp(widgetId: DashboardWidgetId): boolean {
  const order = preferencesStore.order
  const index = order.indexOf(widgetId)
  return index > 0
}

function canMoveDown(widgetId: DashboardWidgetId): boolean {
  const order = preferencesStore.order
  const index = order.indexOf(widgetId)
  return index < order.length - 1 && index !== -1
}
</script>
