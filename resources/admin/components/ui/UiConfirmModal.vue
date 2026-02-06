<template>
  <UiModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">
        {{ title || $t('forms.unsavedChanges.title') }}
      </h3>
    </template>

    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        {{ description || $t('forms.unsavedChanges.description') }}
      </p>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UiButton variant="ghost" size="sm" @click="$emit('cancel')">
          {{ cancelText || $t('forms.unsavedChanges.stay') }}
        </UiButton>
        <UiButton variant="primary" size="sm" @click="$emit('confirm')">
          {{ confirmText || $t('forms.unsavedChanges.continue') }}
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import UiModal from './UiModal.vue'
import UiButton from './UiButton.vue'

interface Props {
  modelValue: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  confirmText: '',
  cancelText: '',
})

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()
</script>
