import { ref, computed } from 'vue'
import type { Notification } from '../types'

const STORAGE_KEY = 'notifications_unread_count'

// Statik örnek notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    severity: 'info',
    title: 'Yeni Sipariş',
    message: '#12345 numaralı sipariş alındı',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 dakika önce
    metadata: { orderId: '12345' },
  },
  {
    id: '2',
    type: 'system',
    severity: 'warning',
    title: 'Stok Uyarısı',
    message: '5 ürünün stoğu kritik seviyede',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 saat önce
  },
  {
    id: '3',
    type: 'reminder',
    severity: 'info',
    title: 'Randevu Hatırlatıcı',
    message: 'Yarın saat 14:00\'te ölçü randevusu var',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 gün önce
  },
]

const notifications = ref<Notification[]>(mockNotifications)

// localStorage'dan unreadCount'u yükle
function loadUnreadCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return parseInt(stored, 10)
    }
  } catch (error) {
    console.warn('Failed to load unread count from localStorage:', error)
  }
  // Eğer localStorage'da yoksa, mevcut notifications'dan hesapla
  return notifications.value.filter((n) => !n.read).length
}

// localStorage'a unreadCount'u kaydet
function saveUnreadCount(count: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, count.toString())
  } catch (error) {
    console.warn('Failed to save unread count to localStorage:', error)
  }
}

// Unread count state (localStorage ile senkronize)
const unreadCount = ref<number>(loadUnreadCount())

// Unread count'u güncelle
function updateUnreadCount(): void {
  const count = notifications.value.filter((n) => !n.read).length
  unreadCount.value = count
  saveUnreadCount(count)
}

// İlk yüklemede unread count'u güncelle
updateUnreadCount()

// Belirli bir notification'ı okundu olarak işaretle
function markRead(id: string): void {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification && !notification.read) {
    notification.read = true
    updateUnreadCount()
  }
}

// Tüm notification'ları okundu olarak işaretle
function markAllRead(): void {
  notifications.value.forEach((notification) => {
    notification.read = true
  })
  updateUnreadCount()
}

export function useNotifications() {
  return {
    notifications: computed(() => notifications.value),
    unreadCount: computed(() => unreadCount.value),
    markRead,
    markAllRead,
  }
}
