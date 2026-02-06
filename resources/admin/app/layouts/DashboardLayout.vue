<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/50 to-gray-50 relative">
    <Sidebar :is-open="sidebarStore.isOpen" @close="sidebarStore.close" />
    <div :class="['transition-all duration-300 relative', sidebarStore.isOpen ? 'ml-64' : 'ml-16']">
      <Topbar @toggle-sidebar="sidebarStore.toggle" />
      <main class="p-6 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20 min-h-screen">
        <router-view />
      </main>
    </div>
    <UiToast />
    <CommandPalette />
    <UiConfirmModal
      :model-value="showRouteConfirmModal"
      @update:model-value="showRouteConfirmModal = $event"
      @confirm="handleRouteConfirm"
      @cancel="handleRouteCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSidebarStore } from '@admin/stores/sidebar'
import Sidebar from '@admin/components/layout/Sidebar.vue'
import Topbar from '@admin/components/layout/Topbar.vue'
import UiToast from '@admin/components/ui/UiToast.vue'
import CommandPalette from '@admin/features/command-palette/components/CommandPalette.vue'
import UiConfirmModal from '@admin/components/ui/UiConfirmModal.vue'
import { resolvePendingNavigation } from '@admin/app/router'

const sidebarStore = useSidebarStore()
const showRouteConfirmModal = ref(false)

function handleRouteConfirm() {
  showRouteConfirmModal.value = false
  resolvePendingNavigation(true)
}

function handleRouteCancel() {
  showRouteConfirmModal.value = false
  resolvePendingNavigation(false)
}

onMounted(() => {
  const handleRouteChange = () => {
    showRouteConfirmModal.value = true
  }
  window.addEventListener('route-change-with-unsaved', handleRouteChange)
  onUnmounted(() => {
    window.removeEventListener('route-change-with-unsaved', handleRouteChange)
  })
})
</script>
