<template>
  <UiCard>
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <UiSkeleton v-for="i in 5" :key="i" height="h-12" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6">
      <UiAlert
        variant="error"
        title="Hata"
        :message="error.message || 'Mağazalar yüklenirken bir hata oluştu.'"
      />
    </div>

    <!-- Empty State -->
    <div v-else-if="!stores || stores.length === 0" class="p-6">
      <UiEmptyState
        title="Henüz mağaza yok"
        description="Mağazalar burada görünecek. İlk mağazayı oluşturmak için butona tıklayın."
        action-label="Yeni Mağaza"
        :action-to="{ name: 'store-create' }"
      />
    </div>

    <!-- Content -->
    <div v-else>
      <UiTable>
        <template #header>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mağaza Adı</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefon</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oluşturulma</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
        </template>
        <template #body>
          <tr
            v-for="store in stores"
            :key="store.id"
            class="hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
            @click="$emit('store-clicked', String(store.id))"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ store.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UiBadge :variant="store.status === 'active' ? 'success' : 'warning'">
                {{ store.status === 'active' ? 'Aktif' : 'Pasif' }}
              </UiBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ store.email || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ store.phone || '—' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(store.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm" @click.stop>
              <div class="flex items-center gap-2">
                <div @click.stop="openPublicStore(store.slug)">
                  <UiButton size="sm" variant="ghost" class="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Mağazaya Git
                  </UiButton>
                </div>
                <div @click.stop="onDeleteClick(store.id)">
                  <UiButton
                    size="sm"
                    variant="ghost"
                    class="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Sil
                  </UiButton>
                </div>
              </div>
            </td>
          </tr>
        </template>
      </UiTable>
    </div>

    <!-- Pagination -->
    <UiPagination
      v-if="!isLoading && !error && stores && stores.length > 0 && totalPages > 1"
      :page="page"
      :page-size="pageSize"
      :total="total"
      @page-change="$emit('page-change', $event)"
    />
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '@admin/components/ui/UiCard.vue'
import UiTable from '@admin/components/ui/UiTable.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import UiAlert from '@admin/components/ui/UiAlert.vue'
import UiEmptyState from '@admin/components/ui/UiEmptyState.vue'
import UiPagination from '@admin/components/ui/UiPagination.vue'
import { computed } from 'vue'
import { formatDate } from '@admin/lib/date'
import type { Store } from '../types'

const props = withDefaults(
  defineProps<{
    stores?: Store[]
    isLoading: boolean
    error?: Error | null
    total?: number
    page?: number
    pageSize?: number
  }>(),
  {
    total: 0,
    page: 1,
    pageSize: 10,
  }
)

const emit = defineEmits<{
  'store-clicked': [id: string]
  'delete-store': [id: string]
  'page-change': [page: number]
}>()

const totalPages = computed(() => {
  if (!props.total || !props.pageSize) return 0
  return Math.ceil(props.total / props.pageSize)
})

function openPublicStore(slug: string) {
  const publicUrl = `${window.location.origin}/stores/${slug}`
  window.open(publicUrl, '_blank')
}

function onDeleteClick(id: string | number) {
  console.log('StoresTableCard: delete clicked for id', id)
  emit('delete-store', String(id))
}
</script>
