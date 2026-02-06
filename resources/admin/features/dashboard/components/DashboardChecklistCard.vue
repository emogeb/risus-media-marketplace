<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.checklist.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.checklist.subtitle') }}</p>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">{{ $t('dashboard.checklist.progressLabel', { completed: completedCount, total: totalCount }) }}</span>
          <span class="font-medium text-gray-900">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- Checklist Items -->
      <div class="space-y-2">
        <div
          v-for="item in checklistItems"
          :key="item.id"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          :class="{
            'bg-green-50 border-green-200': checked[item.id],
          }"
        >
          <!-- Checkbox -->
          <div class="flex-shrink-0">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="checked[item.id] || false"
                class="sr-only peer"
                @change="toggleItem(item.id)"
              />
              <div
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  checked[item.id]
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-300 bg-white',
                ]"
              >
                <svg
                  v-if="checked[item.id]"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
          </div>

          <!-- Item Label -->
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ $t(`dashboard.checklist.items.${item.id}`) }}</p>
          </div>
        </div>
      </div>

      <!-- Reset Button -->
      <div class="pt-2 border-t border-gray-200">
        <UiButton size="sm" variant="ghost" class="w-full" @click="resetAll">
          {{ $t('common.reset') }}
        </UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'

interface ChecklistItem {
  id: string
}

const checklistItems: ChecklistItem[] = [
  { id: 'morningReview' },
  { id: 'orderProcessing' },
  { id: 'inventoryCheck' },
  { id: 'customerFollowup' },
  { id: 'sellerCoordination' },
  { id: 'endOfDayReport' },
]

const checked = ref<Record<string, boolean>>({})

const totalCount = computed(() => checklistItems.length)

const completedCount = computed(() => {
  return Object.values(checked.value).filter(Boolean).length
})

const progress = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

function toggleItem(itemId: string): void {
  checked.value[itemId] = !checked.value[itemId]
}

function resetAll(): void {
  checked.value = {}
}
</script>
