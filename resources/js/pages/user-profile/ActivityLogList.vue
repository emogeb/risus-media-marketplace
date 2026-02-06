<!-- resources/js/components/profile/ActivityLogList.vue -->
<script setup lang="ts">
import { 
  Plus, 
  Trash2, 
  RefreshCw, 
  User, 
  MapPin, 
  CreditCard, 
  Lock, 
  Heart, 
  ShoppingBag, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  FileText
} from 'lucide-vue-next';

interface Log {
  id: number;
  action: string;
  meta: any;
  created_at: string;
}

const props = defineProps<{
  logs: Log[];
  loading?: boolean;
}>();

const getActionInfo = (action: string) => {
  const map: Record<string, { label: string; icon: any; color: string }> = {
    'profile.updated': { label: 'Profil Güncellendi', icon: User, color: 'text-blue-500 bg-blue-50' },
    'avatar.uploaded': { label: 'Profil Fotoğrafı Güncellendi', icon: User, color: 'text-blue-500 bg-blue-50' },
    'address.created': { label: 'Yeni Adres Eklendi', icon: MapPin, color: 'text-green-500 bg-green-50' },
    'address.updated': { label: 'Adres Güncellendi', icon: MapPin, color: 'text-blue-500 bg-blue-50' },
    'address.deleted': { label: 'Adres Silindi', icon: Trash2, color: 'text-red-500 bg-red-50' },
    'address.restored': { label: 'Adres Geri Yüklendi', icon: RefreshCw, color: 'text-green-500 bg-green-50' },
    'billing.updated': { label: 'Fatura Bilgileri Güncellendi', icon: CreditCard, color: 'text-blue-500 bg-blue-50' },
    'password.updated': { label: 'Şifre Değiştirildi', icon: Lock, color: 'text-purple-500 bg-purple-50' },
    'favorite.added': { label: 'Favoriye Eklendi', icon: Heart, color: 'text-pink-500 bg-pink-50' },
    'favorite.removed': { label: 'Favoriden Kaldırıldı', icon: Heart, color: 'text-gray-500 bg-gray-50' },
    'cart.added': { label: 'Sepete Eklendi', icon: ShoppingBag, color: 'text-green-500 bg-green-50' },
    'gdpr.exported': { label: 'Veriler Dışa Aktarıldı', icon: Download, color: 'text-blue-500 bg-blue-50' },
    'account.deletion_requested': { label: 'Hesap Silme Talebi Oluşturuldu', icon: AlertTriangle, color: 'text-orange-500 bg-orange-50' },
    'account.deletion_cancelled': { label: 'Hesap Silme Talebi İptal Edildi', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
  };

  return map[action] || { label: action, icon: FileText, color: 'text-gray-500 bg-gray-50' };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('tr-TR', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const getRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Az önce';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  
  return formatDate(dateStr);
};
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="flex items-center gap-4 rounded-2xl border border-gray-100 p-4">
        <div class="h-10 w-10 animate-pulse rounded-full bg-gray-100"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 w-1/3 animate-pulse rounded bg-gray-100"></div>
          <div class="h-3 w-1/4 animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
    </div>

    <template v-else>
      <div v-if="logs.length === 0" class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 py-16 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <FileText :size="32" />
        </div>
        <h3 class="text-xl font-bold text-gray-900">Henüz işlem yok</h3>
        <p class="mt-2 text-gray-500">Hesap geçmişinizde henüz kaydedilmiş bir işlem bulunmuyor.</p>
      </div>

      <div v-else class="relative space-y-4">
        <div 
          v-for="log in logs" 
          :key="log.id"
          class="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-black/5 hover:shadow-md"
        >
          <div :class="['flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors', getActionInfo(log.action).color]">
            <component :is="getActionInfo(log.action).icon" :size="20" />
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-gray-900 truncate">
              {{ getActionInfo(log.action).label }}
            </h4>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs font-medium text-gray-500">{{ getRelativeTime(log.created_at) }}</span>
              <span v-if="log.meta?.product_title || log.meta?.title" class="text-xs font-bold text-black bg-gray-100 px-2 py-0.5 rounded-full truncate">
                {{ log.meta.product_title || log.meta.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
