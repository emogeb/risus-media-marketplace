<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/50 to-gray-50 relative overflow-x-hidden">
    <!-- Sidebar -->
    <Sidebar 
      :is-open="sidebarStore.isOpen" 
      :is-mobile="isMobile"
      @close="sidebarStore.close" 
    />
    
    <!-- Backdrop for mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isMobile && sidebarStore.isOpen" 
        class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm"
        @click="sidebarStore.close"
      ></div>
    </Transition>

    <div :class="['transition-all duration-300 relative min-h-screen flex flex-col', mainContentClass]">
      <Topbar @toggle-sidebar="sidebarStore.toggle" />
      <main class="flex-1 p-4 md:p-6 bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20">
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSidebarStore } from '@admin/stores/sidebar'
import Sidebar from '@admin/components/layout/Sidebar.vue'
import Topbar from '@admin/components/layout/Topbar.vue'
import UiToast from '@admin/components/ui/UiToast.vue'
import CommandPalette from '@admin/features/command-palette/components/CommandPalette.vue'
import UiConfirmModal from '@admin/components/ui/UiConfirmModal.vue'
import { resolvePendingNavigation } from '@admin/app/router'

const sidebarStore = useSidebarStore()
const showRouteConfirmModal = ref(false)
const isMobile = ref(false)

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const mainContentClass = computed(() => {
  if (isMobile.value) return 'ml-0'
  return sidebarStore.isOpen ? 'ml-64' : 'ml-16'
})

function handleRouteConfirm() {
  showRouteConfirmModal.value = false
  resolvePendingNavigation(true)
}

function handleRouteCancel() {
  showRouteConfirmModal.value = false
  resolvePendingNavigation(false)
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  
  if (isMobile.value) {
    sidebarStore.close()
  }

  const handleRouteChange = () => {
    showRouteConfirmModal.value = true
  }
  window.addEventListener('route-change-with-unsaved', handleRouteChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>
