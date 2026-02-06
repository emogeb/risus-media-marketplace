<template>
  <div class="relative">
    <UiButton
      size="sm"
      variant="secondary"
      @click="showDropdown = !showDropdown"
    >
      {{ $t('dashboard.views.title') }}
      <svg
        class="w-4 h-4 ml-1"
        :class="{ 'rotate-180': showDropdown }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </UiButton>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="showDropdown"
        class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        @click.stop
      >
        <div class="py-1">
          <!-- Preset Views -->
          <div v-if="viewsStore.presetViews.length > 0" class="px-2 py-1.5">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              {{ $t('dashboard.views.presets') }}
            </div>
            <button
              v-for="view in viewsStore.presetViews"
              :key="view.id"
              :class="[
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                viewsStore.activeViewId === view.id
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
              @click="selectView(view.id)"
            >
              {{ view.name }}
            </button>
          </div>

          <!-- Custom Views -->
          <div v-if="viewsStore.customViews.length > 0" class="px-2 py-1.5 border-t border-gray-100">
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
              {{ $t('dashboard.views.custom') }}
            </div>
            <button
              v-for="view in viewsStore.customViews"
              :key="view.id"
              :class="[
                'w-full text-left px-3 py-2 text-sm rounded-md transition-colors',
                viewsStore.activeViewId === view.id
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50',
              ]"
              @click="selectView(view.id)"
            >
              {{ view.name }}
            </button>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-100 px-2 py-1">
            <button
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              @click="showSaveModal = true"
            >
              {{ $t('dashboard.views.saveCurrent') }}
            </button>
            <button
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              @click="showManageDrawer = true"
            >
              {{ $t('dashboard.views.manage') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Save View Modal -->
    <UiModal :model-value="showSaveModal" @update:model-value="showSaveModal = $event">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ $t('dashboard.views.saveModal.title') }}
        </h3>
      </template>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            {{ $t('dashboard.views.saveModal.nameLabel') }}
          </label>
          <input
            v-model="newViewName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="$t('dashboard.views.saveModal.namePlaceholder')"
            @keydown.enter="saveView"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UiButton variant="ghost" size="sm" @click="showSaveModal = false">
            {{ $t('dashboard.views.saveModal.cancel') }}
          </UiButton>
          <UiButton
            variant="primary"
            size="sm"
            :disabled="!newViewName.trim()"
            @click="saveView"
          >
            {{ $t('dashboard.views.saveModal.save') }}
          </UiButton>
        </div>
      </template>
    </UiModal>

    <!-- Manage Views Drawer -->
    <DashboardViewsManageDrawer
      :is-open="showManageDrawer"
      @update:is-open="showManageDrawer = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDashboardViewsStore } from '@admin/stores/dashboardViews'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiModal from '@admin/components/ui/UiModal.vue'
import DashboardViewsManageDrawer from './DashboardViewsManageDrawer.vue'

const viewsStore = useDashboardViewsStore()

const showDropdown = ref(false)
const showSaveModal = ref(false)
const showManageDrawer = ref(false)
const newViewName = ref('')

function selectView(id: string): void {
  viewsStore.applyView(id)
  showDropdown.value = false
}

function saveView(): void {
  if (!newViewName.value.trim()) return

  viewsStore.saveCurrentAs(newViewName.value.trim())
  newViewName.value = ''
  showSaveModal.value = false
  showDropdown.value = false
}

function handleClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
