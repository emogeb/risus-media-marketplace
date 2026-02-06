<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900">Mağaza Seçiniz</h3>
      <p v-if="selectedStoreId" class="text-sm text-gray-600">
        Seçili: <span class="font-medium text-blue-600">{{ selectedStoreName }}</span>
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UiSkeleton v-for="i in 3" :key="i" height="h-32" />
    </div>

    <!-- Error State -->
    <UiAlert
      v-else-if="error"
      variant="error"
      title="Hata"
      :message="error.message || 'Mağazalar yüklenirken bir hata oluştu.'"
    />

    <!-- Empty State -->
    <UiCard v-else-if="!stores || stores.length === 0" padding="lg">
      <div class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Henüz mağaza yok</h3>
        <p class="mt-1 text-sm text-gray-500">Önce bir mağaza oluşturmalısınız.</p>
        <div class="mt-6">
          <UiButton variant="primary" size="sm" @click="$router.push({ name: 'store-create' })">
            Yeni Mağaza Oluştur
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Store Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="store in stores"
        :key="store.id"
        :class="[
          'relative text-left rounded-xl border-2 p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          selectedStoreId === store.id
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm',
        ]"
        @click="handleSelect(store.id)"
      >
        <!-- Selected Badge -->
        <div
          v-if="selectedStoreId === store.id"
          class="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center shadow-sm"
        >
          <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div class="flex items-start gap-3">
          <!-- Store Logo -->
          <div class="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center p-2">
            <img v-if="store.logo_url" :src="store.logo_url" class="max-h-full max-w-full object-contain" />
            <svg v-else class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          <!-- Store Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-900 truncate">{{ store.name }}</h4>
            <p class="text-xs text-gray-500 truncate mt-0.5">{{ store.slug }}</p>
            <div class="flex items-center gap-2 mt-2">
              <UiBadge :variant="store.status === 'active' ? 'success' : 'warning'" size="sm">
                {{ store.status === 'active' ? 'Aktif' : 'Pasif' }}
              </UiBadge>
            </div>
          </div>
        </div>

        <!-- Store Details -->
        <div class="mt-3 space-y-1">
          <p v-if="store.email" class="text-xs text-gray-600 truncate flex items-center gap-1">
            <svg class="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {{ store.email }}
          </p>
          <p v-if="store.phone" class="text-xs text-gray-600 truncate flex items-center gap-1">
            <svg class="h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {{ store.phone }}
          </p>
        </div>

        <!-- View Button (shown when selected) -->
        <div v-if="selectedStoreId === store.id" class="mt-3 pt-3 border-t border-gray-200">
          <button
            class="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            @click.stop="handleViewStore(store.id)"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Görüntüle
          </button>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import type { Store } from '../types'

const props = defineProps<{
  stores?: Store[]
  isLoading: boolean
  error?: Error | null
  selectedStoreId?: string | number | null
}>()

const emit = defineEmits<{
  select: [storeId: number]
  'view-store': [storeId: number]
}>()

const router = useRouter()

const selectedStoreName = computed(() => {
  if (!props.selectedStoreId || !props.stores) return ''
  const store = props.stores.find(s => String(s.id) === String(props.selectedStoreId))
  return store?.name || ''
})

function handleSelect(storeId: string | number) {
  emit('select', Number(storeId))
}

function handleViewStore(storeId: string | number) {
  emit('view-store', Number(storeId))
}
</script>
