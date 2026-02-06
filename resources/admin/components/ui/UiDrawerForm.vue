<template>
  <UiDrawer :model-value="open" @update:model-value="$emit('update:open', $event)" width="lg">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
          <p v-if="description" class="mt-1 text-sm text-gray-500">{{ description }}</p>
        </div>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-500 transition-colors"
          @click="$emit('update:open', false)"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" @keydown="handleKeydown">
      <div class="space-y-4">
        <slot />
      </div>
    </form>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <UiButton variant="ghost" :disabled="props.submitting" @click="handleCancel">
          {{ cancelText }}
        </UiButton>
        <UiButton type="submit" variant="primary" :disabled="props.submitting" @click="handleSubmit">
          <span v-if="props.submitting" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ $t('forms.submitting', 'Kaydediliyor...') }}
          </span>
          <span v-else>{{ submitText }}</span>
        </UiButton>
      </div>
    </template>
  </UiDrawer>
</template>

<script setup lang="ts">
import UiDrawer from './UiDrawer.vue'
import UiButton from './UiButton.vue'

interface Props {
  title: string
  description?: string
  open: boolean
  submitText?: string
  cancelText?: string
  submitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  submitText: 'Kaydet',
  cancelText: 'İptal',
  submitting: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: []
  cancel: []
}>()

function handleSubmit() {
  emit('submit')
}

function handleCancel() {
  emit('cancel')
  emit('update:open', false)
}

function handleKeydown(event: KeyboardEvent) {
  // ESC to close
  if (event.key === 'Escape') {
    handleCancel()
    return
  }

  // Enter to submit (but not in textarea)
  if (event.key === 'Enter' && !props.submitting) {
    const target = event.target as HTMLElement
    if (target.tagName !== 'TEXTAREA') {
      event.preventDefault()
      handleSubmit()
    }
  }
}
</script>
