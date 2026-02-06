<template>
  <UiDrawer :model-value="isOpen" @update:model-value="close">
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.views.manageTitle') }}
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
      <!-- Custom Views List -->
      <div v-if="viewsStore.customViews.length > 0" class="space-y-2">
        <div
          v-for="view in viewsStore.customViews"
          :key="view.id"
          class="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
        >
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900">{{ view.name }}</div>
            <div class="text-xs text-gray-500 mt-0.5">
              {{ formatDate(view.createdAt) }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              @click="startRename(view)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              class="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              @click="confirmDelete(view)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="py-8 text-center">
        <p class="text-sm text-gray-500">{{ $t('dashboard.views.noCustomViews') }}</p>
      </div>
    </div>

    <template #footer>
      <UiButton variant="primary" size="sm" @click="close">
        {{ $t('dashboard.views.close') }}
      </UiButton>
    </template>

    <!-- Rename Modal -->
    <UiModal :model-value="showRenameModal" @update:model-value="showRenameModal = $event">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.views.renameModal.title') }}
        </h3>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('dashboard.views.renameModal.nameLabel') }}
          </label>
          <input
            v-model="renameValue"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keydown.enter="saveRename"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" size="sm" @click="showRenameModal = false">
            {{ $t('dashboard.views.renameModal.cancel') }}
          </UiButton>
          <UiButton
            variant="primary"
            size="sm"
            :disabled="!renameValue.trim()"
            @click="saveRename"
          >
            {{ $t('dashboard.views.renameModal.save') }}
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal :model-value="showDeleteModal" @update:model-value="showDeleteModal = $event">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.views.deleteModal.title') }}
        </h3>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ $t('dashboard.views.deleteModal.message', { name: viewToDelete?.name }) }}
        </p>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" size="sm" @click="showDeleteModal = false">
            {{ $t('dashboard.views.deleteModal.cancel') }}
          </UiButton>
          <UiButton variant="danger" size="sm" @click="confirmDeleteAction">
            {{ $t('dashboard.views.deleteModal.delete') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </UiDrawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDashboardViewsStore } from '@admin/stores/dashboardViews'
import type { DashboardView } from '@admin/features/dashboard/views/types'
import UiDrawer from '@admin/components/ui/UiDrawer.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiModal from '@admin/components/ui/UiModal.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const viewsStore = useDashboardViewsStore()

function close(): void {
  emit('update:isOpen', false)
}

const showRenameModal = ref(false)
const showDeleteModal = ref(false)
const viewToRename = ref<DashboardView | null>(null)
const viewToDelete = ref<DashboardView | null>(null)
const renameValue = ref('')

function startRename(view: DashboardView): void {
  viewToRename.value = view
  renameValue.value = view.name
  showRenameModal.value = true
}

function saveRename(): void {
  if (!viewToRename.value || !renameValue.value.trim()) return

  viewsStore.renameView(viewToRename.value.id, renameValue.value.trim())
  showRenameModal.value = false
  viewToRename.value = null
  renameValue.value = ''
}

function confirmDelete(view: DashboardView): void {
  viewToDelete.value = view
  showDeleteModal.value = true
}

function confirmDeleteAction(): void {
  if (!viewToDelete.value) return

  viewsStore.deleteView(viewToDelete.value.id)
  showDeleteModal.value = false
  viewToDelete.value = null
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
