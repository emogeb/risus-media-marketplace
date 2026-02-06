<template>
  <UiCard padding="none">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Bildirimler</h2>
        <button
          v-if="unreadCount > 0"
          @click="markAllRead"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Tümünü okundu işaretle
        </button>
      </div>
    </div>

    <div v-if="notifications.length === 0" class="p-12 text-center">
      <p class="text-gray-500 text-sm">Bildirim bulunmuyor</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'p-4 hover:bg-gray-50/50 transition-colors cursor-pointer',
          !notification.read && 'bg-blue-50/30',
        ]"
        @click="handleNotificationClick(notification.id)"
      >
        <div class="flex items-start gap-3">
          <div
            :class="[
              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
              getSeverityColor(notification.severity),
            ]"
          ></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3
                    :class="[
                      'text-sm font-medium',
                      notification.read ? 'text-gray-700' : 'text-gray-900',
                    ]"
                  >
                    {{ notification.title }}
                  </h3>
                  <UiBadge :variant="getBadgeVariant(notification.type)" class="text-xs">
                    {{ getTypeLabel(notification.type) }}
                  </UiBadge>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ notification.message }}</p>
                <p class="text-xs text-gray-500">{{ formatRelativeTime(notification.createdAt) }}</p>
              </div>
              <div v-if="!notification.read" class="flex-shrink-0">
                <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import { useNotifications } from '../composables/useNotifications'
import type { NotificationSeverity, NotificationType } from '../types'

const { notifications, unreadCount, markRead, markAllRead } = useNotifications()

function handleNotificationClick(id: string) {
  markRead(id)
}

function getSeverityColor(severity: NotificationSeverity): string {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }
  return colors[severity]
}

function getBadgeVariant(type: NotificationType): 'info' | 'warning' | 'danger' | 'success' | 'default' {
  const variants = {
    order: 'info',
    system: 'default',
    alert: 'warning',
    reminder: 'success',
  }
  return variants[type] || 'default'
}

function getTypeLabel(type: NotificationType): string {
  const labels = {
    order: 'Sipariş',
    system: 'Sistem',
    alert: 'Uyarı',
    reminder: 'Hatırlatıcı',
  }
  return labels[type] || type
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) {
    return 'Az önce'
  } else if (diffMins < 60) {
    return `${diffMins} dakika önce`
  } else if (diffHours < 24) {
    return `${diffHours} saat önce`
  } else if (diffDays < 7) {
    return `${diffDays} gün önce`
  } else {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
}
</script>
