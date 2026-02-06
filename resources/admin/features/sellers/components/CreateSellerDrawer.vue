<template>
  <UiDrawerForm
    :open="isOpen"
    :title="$t('sellers.create.title')"
    :description="$t('sellers.create.description')"
    :submit-text="$t('sellers.create.submit')"
    :cancel-text="$t('sellers.create.cancel')"
    :submitting="isSubmitting"
    @update:open="handleDrawerClose"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- Seller Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('sellers.create.fields.name.label') }}
        <span class="text-red-500">*</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        :class="[
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          errors.name ? 'border-red-300' : 'border-gray-300',
        ]"
        :placeholder="$t('sellers.create.fields.name.placeholder')"
      />
      <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
    </div>

    <!-- Contact Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('sellers.create.fields.contactName.label') }}
      </label>
      <input
        v-model="form.contactName"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :placeholder="$t('sellers.create.fields.contactName.placeholder')"
      />
    </div>

    <!-- Phone -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('sellers.create.fields.phone.label') }}
      </label>
      <input
        v-model="form.phone"
        type="tel"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :placeholder="$t('sellers.create.fields.phone.placeholder')"
      />
    </div>

    <!-- Email -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('sellers.create.fields.email.label') }}
      </label>
      <input
        v-model="form.email"
        type="email"
        :class="[
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          errors.email ? 'border-red-300' : 'border-gray-300',
        ]"
        :placeholder="$t('sellers.create.fields.email.placeholder')"
      />
      <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
    </div>

    <!-- City -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('sellers.create.fields.city.label') }}
      </label>
      <input
        v-model="form.city"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :placeholder="$t('sellers.create.fields.city.placeholder')"
      />
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        {{ $t('sellers.create.fields.status.label') }}
      </label>
      <select
        v-model="form.status"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="active">{{ $t('sellers.create.fields.status.options.active') }}</option>
        <option value="inactive">{{ $t('sellers.create.fields.status.options.inactive') }}</option>
      </select>
    </div>
  </UiDrawerForm>

  <!-- Unsaved Changes Confirmation Modal -->
  <UiConfirmModal
    :model-value="showConfirmModal"
    @update:model-value="showConfirmModal = $event"
    @confirm="handleConfirmLeave"
    @cancel="handleCancelLeave"
  />
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@admin/composables/useToast'
import { required, email as validateEmail } from '@admin/lib/forms/validators'
import { useUnsavedChanges } from '@admin/lib/forms/useUnsavedChanges'
import { useDraft } from '@admin/lib/forms/useDraft'
import { debounce } from '@admin/lib/utils'
import UiDrawerForm from '@admin/components/ui/UiDrawerForm.vue'
import UiConfirmModal from '@admin/components/ui/UiConfirmModal.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const { t } = useI18n()
const { showSuccess, showInfo } = useToast()

const isSubmitting = ref(false)
const showConfirmModal = ref(false)

// Unsaved changes tracking
const { hasChanges, markDirty, markClean, confirmIfDirty, getPendingConfirm } = useUnsavedChanges()

// Listen for unsaved changes prompt
const handlePrompt = () => {
  showConfirmModal.value = true
}

onMounted(() => {
  window.addEventListener('unsaved-changes-prompt', handlePrompt)
})

onUnmounted(() => {
  window.removeEventListener('unsaved-changes-prompt', handlePrompt)
})

// Draft autosave
const initialFormState = {
  name: '',
  contactName: '',
  phone: '',
  email: '',
  city: '',
  status: 'active' as 'active' | 'inactive',
}

const { formState: draftForm, loadDraft, clearDraft, saveDraft } = useDraft(
  'seller-create',
  initialFormState
)

const form = reactive({ ...initialFormState })

const errors = reactive<Record<string, string>>({})

// Debounced autosave
const debouncedSave = debounce(() => {
  Object.assign(draftForm.value, form)
  saveDraft()
}, 500)

// Load draft on mount
onMounted(() => {
  const saved = loadDraft()
  if (saved) {
    Object.assign(form, saved)
    markDirty()
  }
})

// Watch form changes for unsaved changes tracking and autosave
watch(
  form,
  () => {
    markDirty()
    debouncedSave()
  },
  { deep: true }
)

function validateForm(): boolean {
  errors.name = ''
  errors.email = ''

  // Validate name (required)
  const nameValidation = required(form.name)
  if (!nameValidation.valid) {
    errors.name = nameValidation.message || ''
  }

  // Validate email (if provided)
  if (form.email) {
    const emailValidation = validateEmail(form.email)
    if (!emailValidation.valid) {
      errors.email = emailValidation.message || ''
    }
  }

  return !errors.name && !errors.email
}

function resetForm(): void {
  form.name = ''
  form.contactName = ''
  form.phone = ''
  form.email = ''
  form.city = ''
  form.status = 'active'
  errors.name = ''
  errors.email = ''
  markClean()
  clearDraft()
}

function handleSubmit(): void {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  // TODO: API çağrısı yapılacak
  // await createSeller(form)

  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false
    showInfo(
      t('sellers.create.messages.pending'),
      t('sellers.create.messages.pendingDescription')
    )
    resetForm()
    emit('update:isOpen', false)
  }, 500)
}

async function handleCancel(): Promise<void> {
  const confirmed = await confirmIfDirty(() => {
    resetForm()
    emit('update:isOpen', false)
  })

  if (!confirmed) {
    // User cancelled - do nothing
    return
  }
}

async function handleDrawerClose(value: boolean): Promise<void> {
  if (!value) {
    // Drawer is being closed
    const confirmed = await confirmIfDirty(() => {
      emit('update:isOpen', false)
    })

    if (!confirmed) {
      // User cancelled - prevent close by not emitting
      return
    }
  }

  emit('update:isOpen', value)
}

function handleConfirmLeave(): void {
  showConfirmModal.value = false
  const pending = getPendingConfirm()
  if (pending) {
    pending(true)
  }
}

function handleCancelLeave(): void {
  showConfirmModal.value = false
  const pending = getPendingConfirm()
  if (pending) {
    pending(false)
  }
}
</script>
