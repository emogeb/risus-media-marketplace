<template>
  <div class="space-y-8">
    <PageHeader
      title="Ana Sayfa Video & Öne Çıkanlar"
      description="Videosu dönecek mağazaları seçin ve sıralayın"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="p-12 text-center text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
      Yükleniyor...
    </div>
    
    <div v-else-if="stores.length === 0" class="p-8 text-center text-gray-500 bg-white rounded-lg border border-dashed">
      Henüz sisteme kayıtlı mağaza bulunamadı.
    </div>

    <div v-else class="space-y-10">
      
      <!-- Section 1: Featured & Ordered Stores -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span class="text-2xl">🌟</span> Vitrin Sıralaması (Ana Sayfa)
          </h2>
          <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {{ featuredStores.length }} Mağaza Gösteriliyor
          </span>
        </div>

        <div v-if="featuredStores.length === 0" class="text-gray-500 italic p-8 bg-blue-50/50 rounded-lg border border-dashed border-blue-200 text-center">
          Henüz vitrine eklenmiş mağaza yok. Aşağıdaki listeden "Video Var" olan mağazaları aktifleştirin.
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(store, index) in featuredStores"
            :key="store.id"
            class="bg-white border-2 border-primary/20 rounded-lg p-4 shadow-sm flex flex-col relative group hover:border-primary/50 transition-all duration-200"
          >
            <!-- Order Badge -->
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md z-10 border-2 border-white">
              {{ index + 1 }}
            </div>

            <!-- Header -->
            <div class="mb-3 pl-2">
               <h3 class="font-bold text-lg text-gray-900 truncate">{{ store.name }}</h3>
               <p class="text-xs text-gray-500 line-clamp-1">{{ store.description || 'Slogan yok' }}</p>
            </div>
            
            <!-- Video Preview -->
            <div class="relative aspect-video bg-gray-900 rounded-md overflow-hidden mb-3 group-hover:shadow-md transition-shadow">
                <video 
                   :src="store.hero_video_url!" 
                   class="w-full h-full object-cover" 
                   muted 
                   loop 
                   onmouseover="this.play()" 
                   onmouseout="this.pause();"
                ></video>
            </div>

            <!-- Controls -->
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
               <!-- Reorder Buttons -->
               <div class="flex items-center gap-1">
                  <button 
                    @click="moveStore(index, -1)" 
                    :disabled="index === 0 || isReordering"
                    class="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Sırayı Öne Taşı"
                  >
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button 
                    @click="moveStore(index, 1)" 
                    :disabled="index === featuredStores.length - 1 || isReordering"
                    class="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Sırayı Arkaya Taşı"
                  >
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
               </div>

               <!-- Toggle -->
               <div class="flex items-center gap-2">
                 <span class="text-xs font-medium text-green-600">Aktif</span>
                 <UiToggle
                   :model-value="true"
                   :disabled="isReordering || isUpdating(store.id)"
                   @update:model-value="(val) => handleToggle(store, val)"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-gray-200" />

      <!-- Section 2: Other Stores -->
      <section>
        <h2 class="text-lg font-semibold mb-4 text-gray-500">Diğer Mağazalar</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
          <div
            v-for="store in otherStores"
            :key="store.id"
            :class="[
              'border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 bg-gray-50',
              !store.hero_video_url ? 'opacity-60 grayscale-[0.5]' : ''
            ]"
            style="transform: scale(0.95);"
          >
            <div class="mb-3">
               <div class="flex items-start justify-between">
                  <h3 class="font-bold text-base text-gray-700 truncate pr-2">{{ store.name }}</h3>
                  <span v-if="store.hero_video_url" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                    Video Var
                  </span>
               </div>
            </div>
            
            <div v-if="store.hero_video_url" class="relative aspect-video bg-gray-200 rounded-md overflow-hidden mb-3">
                <video :src="store.hero_video_url" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"></video>
            </div>
            <div v-else class="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400 text-xs p-4 border border-dashed text-center">
                Video Yüklenmemiş
            </div>

            <div class="flex items-center justify-between border-t pt-3 mt-auto">
               <div v-if="!store.hero_video_url" class="text-xs text-red-400 font-medium">
                  Video eksik
               </div>
               <div v-else class="text-xs text-gray-500">
                  Vitrine Ekle
               </div>

               <UiToggle
                 :model-value="!!store.is_featured_on_hero"
                 :disabled="!store.hero_video_url || isUpdating(store.id)"
                 @update:model-value="(val) => handleToggle(store, val)"
               />
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQueryClient, useMutation } from '@tanstack/vue-query'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiToggle from '@admin/components/ui/UiToggle.vue'
import { useStoresQuery } from '@admin/features/stores/composables/useStoresQuery'
import { updateStore, reorderStores } from '@admin/features/stores/api/stores.api'
import type { Store } from '@admin/features/stores/types'
import { toastService } from '@admin/composables/useToast'

// Fetch up to 100 active stores
const { data: storesResponse, isLoading } = useStoresQuery({ pageSize: 100, status: 'active' })

const stores = computed(() => {
  const list = [...(storesResponse.value?.data || [])];
  // Sort by hero_order (asc), then id (asc)
  return list.sort((a, b) => (a.hero_order || 0) - (b.hero_order || 0) || a.id - b.id);
});

const featuredStores = computed(() => stores.value.filter(s => s.is_featured_on_hero && s.hero_video_url));
const otherStores = computed(() => stores.value.filter(s => !s.is_featured_on_hero || !s.hero_video_url));

const queryClient = useQueryClient()
const updatingIds = ref<Set<number>>(new Set())

// Toggle Mutation
const toggleMutation = useMutation({
  mutationFn: ({ id, isFeatured }: { id: number; isFeatured: boolean }) => 
    updateStore(String(id), { is_featured_on_hero: isFeatured }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['stores'] })
    toastService.showSuccess('Başarılı', 'Mağaza durumu güncellendi')
  },
  onError: () => toastService.showError('Hata', 'Güncelleme başarısız')
})

async function handleToggle(store: Store, value: boolean) {
  if (!store.hero_video_url) return
  updatingIds.value.add(store.id)
  try {
    await toggleMutation.mutateAsync({ id: store.id, isFeatured: value })
  } finally {
    updatingIds.value.delete(store.id)
  }
}

function isUpdating(id: number) {
  return updatingIds.value.has(id)
}

// Reorder Mutation
const reorderMutation = useMutation({
    mutationFn: (items: { id: number, order: number }[]) => reorderStores(items),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stores'] })
        toastService.showSuccess('Sıralama Güncellendi', 'Vitrin sırası başarıyla değiştirildi.')
    },
    onError: () =>  toastService.showError('Hata', 'Sıralama güncellenemedi')
});

const isReordering = computed(() => reorderMutation.isPending.value);

async function moveStore(index: number, direction: number) {
    if (isReordering.value) return;
    
    // Work with a copy of the currently displayed featured stores
    const items = [...featuredStores.value];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= items.length) return;
    
    // Swap in local array
    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
    
    // Calculate new orders. 
    // We assign 1-based index as order for ALL featured items in their new sequence.
    const updates = items.map((store, idx) => ({
        id: store.id,
        order: idx + 1
    }));
    
    try {
        await reorderMutation.mutateAsync(updates);
    } catch(e) {
        // Error handled in mutation
    }
}
</script>
