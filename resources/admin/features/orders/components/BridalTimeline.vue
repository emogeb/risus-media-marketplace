<template>
  <div class="space-y-4">
    <div
      v-for="(step, index) in bridalSteps"
      :key="step.status"
      class="flex gap-4"
    >
      <!-- Timeline line -->
      <div class="flex flex-col items-center">
        <div
          :class="[
            'w-3 h-3 rounded-full border-2 transition-colors',
            getStepStatus(step.status) === 'current'
              ? 'bg-blue-600 border-blue-600'
              : getStepStatus(step.status) === 'completed'
                ? 'bg-green-500 border-green-500'
                : 'bg-gray-200 border-gray-300',
          ]"
        />
        <div
          v-if="index < bridalSteps.length - 1"
          :class="[
            'w-0.5 flex-1 mt-1',
            getStepStatus(step.status) === 'completed' ? 'bg-green-500' : 'bg-gray-200',
          ]"
        />
      </div>

      <!-- Step content -->
      <div class="flex-1 pb-6">
        <div
          :class="[
            'text-sm font-medium',
            getStepStatus(step.status) === 'current'
              ? 'text-blue-600'
              : getStepStatus(step.status) === 'completed'
                ? 'text-gray-900'
                : 'text-gray-400',
          ]"
        >
          {{ step.label }}
        </div>
        <div
          v-if="getStepStatus(step.status) === 'current'"
          class="text-xs text-gray-500 mt-1"
        >
          Şu anki adım
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BridalStatus } from '../types'

const props = defineProps<{
  currentStatus?: BridalStatus
}>()

const bridalSteps: Array<{ status: BridalStatus; label: string }> = [
  { status: 'new', label: 'Yeni Sipariş' },
  { status: 'measurement_pending', label: 'Ölçü Bekleniyor' },
  { status: 'measurement_done', label: 'Ölçü Alındı' },
  { status: 'fitting_1_scheduled', label: '1. Prova Planlandı' },
  { status: 'fitting_1_done', label: '1. Prova Tamamlandı' },
  { status: 'alteration_in_progress', label: 'Tadilat Sürüyor' },
  { status: 'fitting_2_scheduled', label: '2. Prova Planlandı' },
  { status: 'ready_for_pickup', label: 'Teslime Hazır' },
  { status: 'shipped', label: 'Kargoda' },
  { status: 'completed', label: 'Tamamlandı' },
]

function getStepStatus(stepStatus: BridalStatus): 'completed' | 'current' | 'pending' {
  if (!props.currentStatus) return 'pending'

  const currentIndex = bridalSteps.findIndex((s) => s.status === props.currentStatus)
  const stepIndex = bridalSteps.findIndex((s) => s.status === stepStatus)

  if (stepIndex < currentIndex) return 'completed'
  if (stepIndex === currentIndex) return 'current'
  return 'pending'
}
</script>
