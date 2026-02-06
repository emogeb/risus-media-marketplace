<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.widgets.setup.title') }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          {{ $t('dashboard.widgets.setup.subtitle') }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">{{ $t('dashboard.widgets.setup.progress') }}</span>
          <span class="font-medium text-gray-900">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- Steps List -->
      <div class="space-y-2">
        <div
          v-for="step in steps"
          :key="step.id"
          class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          :class="{
            'bg-green-50 border-green-200': isCompleted(step.id),
          }"
        >
          <!-- Checkbox -->
          <div class="flex-shrink-0">
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="isCompleted(step.id)"
                class="sr-only peer"
                @change="toggleStep(step.id)"
              />
              <div
                :class="[
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  isCompleted(step.id)
                    ? 'bg-green-600 border-green-600'
                    : 'border-gray-300 bg-white',
                ]"
              >
                <svg
                  v-if="isCompleted(step.id)"
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

          <!-- Step Info -->
          <div class="flex-1 min-w-0">
            <p
              :class="[
                'text-sm font-medium',
                isCompleted(step.id) ? 'text-green-900 line-through' : 'text-gray-900',
              ]"
            >
              {{ $t(`dashboard.widgets.setup.steps.${step.id}.title`) }}
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ $t(`dashboard.widgets.setup.steps.${step.id}.description`) }}
            </p>
          </div>

          <!-- Action Button -->
          <div class="flex-shrink-0">
            <UiButton
              v-if="step.route"
              size="sm"
              variant="ghost"
              @click="handleStepClick(step)"
            >
              {{ $t('dashboard.widgets.setup.go') }}
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </UiButton>
            <UiButton
              v-else-if="step.id === 'customize-dashboard'"
              size="sm"
              variant="ghost"
              @click="openCustomize"
            >
              {{ $t('dashboard.widgets.setup.customize') }}
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </UiButton>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div v-if="isAllCompleted" class="pt-2 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <p class="text-sm text-green-600 font-medium">
            {{ $t('dashboard.widgets.setup.allCompleted') }}
          </p>
          <UiButton variant="ghost" size="sm" @click="resetAll">
            {{ $t('dashboard.widgets.setup.resetAll') }}
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Customize Drawer (hidden, opened programmatically) -->
    <DashboardCustomizeDrawer
      :is-open="showCustomize"
      @update:is-open="showCustomize = $event"
    />
  </UiCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSetupChecklist, type SetupStepId } from '../composables/useSetupChecklist'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import DashboardCustomizeDrawer from './DashboardCustomizeDrawer.vue'

const router = useRouter()
const {
  steps,
  completedSteps,
  progress,
  isAllCompleted,
  toggleStep,
  resetAll,
} = useSetupChecklist()

const showCustomize = ref(false)

function isCompleted(stepId: SetupStepId): boolean {
  return completedSteps.value.has(stepId)
}

function handleStepClick(step: { id: SetupStepId; route?: string }): void {
  if (step.route) {
    router.push(step.route)
  }
}

function openCustomize(): void {
  showCustomize.value = true
}
</script>
