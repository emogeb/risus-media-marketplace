<template>
  <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200/80 shadow-sm">
    <div class="flex h-16 items-center justify-between px-6">
      <!-- Left: Menu Toggle + Breadcrumb -->
      <div class="flex items-center gap-4">
        <button
          class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
          @click="$emit('toggle-sidebar')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-2 text-sm text-gray-600 overflow-hidden">
          <span class="font-medium text-gray-900 truncate">{{ breadcrumb }}</span>
        </div>
      </div>

      <!-- Right: Siteye git + Locale + Notifications + User Menu -->
      <div class="flex items-center gap-2 md:gap-3">
        <UiButton
          variant="ghost"
          size="sm"
          class="gap-2"
          @click="goToSite"
        >
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span class="hidden sm:inline">Siteye git</span>
        </UiButton>
        <LocaleSwitch />
        <div class="relative" ref="notificationsContainer">
          <button
            class="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Bildirimler"
            @click.stop="toggleNotificationsPanel"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>
          <!-- Notifications Panel -->
          <div
            v-if="isNotificationsPanelOpen"
            class="absolute right-0 top-full mt-2 w-96 z-50"
            @click.stop
          >
            <NotificationsPanel />
          </div>
        </div>
        <UserMenu :show-name="true" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import LocaleSwitch from './LocaleSwitch.vue'
import UserMenu from './UserMenu.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import NotificationsPanel from '@admin/features/notifications/components/NotificationsPanel.vue'
import { useNotifications } from '@admin/features/notifications/composables/useNotifications'

defineEmits<{
  'toggle-sidebar': []
}>()

const route = useRoute()
const { unreadCount } = useNotifications()
const isNotificationsPanelOpen = ref(false)
const notificationsContainer = ref<HTMLElement | null>(null)

function goToSite() {
  window.open('/', '_blank', 'noopener,noreferrer')
}

function toggleNotificationsPanel() {
  isNotificationsPanelOpen.value = !isNotificationsPanelOpen.value
}

function closeNotificationsPanel() {
  isNotificationsPanelOpen.value = false
}

// Click outside handler
function handleClickOutside(event: MouseEvent) {
  if (
    notificationsContainer.value &&
    !notificationsContainer.value.contains(event.target as Node)
  ) {
    closeNotificationsPanel()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const breadcrumb = computed(() => {
  // Try to get title from route meta
  if (route.meta.title) {
    return route.meta.title as string
  }
  // Fallback: humanize route name
  const name = route.name as string
  if (!name) return 'Dashboard'
  const nameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    orders: 'Siparişler',
    fulfillment: 'Sevkiyat',
    products: 'Ürünler',
    customers: 'Müşteriler',
    analytics: 'Analitik',
    settings: 'Ayarlar',
  }
  return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1)
})
</script>
