<template>
  <UiModal :model-value="isOpen" @update:model-value="$emit('close')">
    <template #header>
      <h2 class="text-xl font-semibold text-gray-900">{{ product?.name || 'Ürün Detayı' }}</h2>
    </template>
    <div v-if="product" class="space-y-6">
      <!-- Temel Bilgiler -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Temel Bilgiler</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 mb-1">SKU (Varsayılan Varyant)</p>
            <p class="text-sm font-medium text-gray-900">{{ product.sku || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Kategori</p>
            <p class="text-sm font-medium text-gray-900">{{ formatCategory(product.category) }}</p>
          </div>
          <div v-if="product.designer">
            <p class="text-xs text-gray-500 mb-1">Tasarımcı</p>
            <p class="text-sm font-medium text-gray-900">{{ product.designer }}</p>
          </div>
          <div v-if="product.collection">
            <p class="text-xs text-gray-500 mb-1">Koleksiyon</p>
            <p class="text-sm font-medium text-gray-900">{{ product.collection }}</p>
          </div>
          <div v-if="product.silhouette">
            <p class="text-xs text-gray-500 mb-1">Siluet</p>
            <p class="text-sm font-medium text-gray-900">{{ product.silhouette }}</p>
          </div>
          <div v-if="product.fabric">
            <p class="text-xs text-gray-500 mb-1">Kumaş</p>
            <p class="text-sm font-medium text-gray-900">{{ product.fabric }}</p>
          </div>
          <div v-if="product.color">
            <p class="text-xs text-gray-500 mb-1">Renk</p>
            <p class="text-sm font-medium text-gray-900">{{ product.color }}</p>
          </div>
        </div>
      </div>

      <!-- Atölye / Üretim -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Atölye / Üretim</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 mb-1">Durum</p>
            <ProductAvailabilityBadge :availability="product.availability || 'in_stock'" />
          </div>
          <div v-if="product.leadTimeDays !== undefined">
            <p class="text-xs text-gray-500 mb-1">Hazırlık Süresi</p>
            <p class="text-sm font-medium text-gray-900">{{ product.leadTimeDays }} gün</p>
          </div>
          <div v-if="product.requiresAppointment">
            <p class="text-xs text-gray-500 mb-1">Randevu Gereksinimi</p>
            <UiBadge variant="info">Randevu Gerekli</UiBadge>
          </div>
        </div>
      </div>

      <!-- Ürün Özellikleri (Attributes) -->
      <div v-if="product.attributes && product.attributes.length > 0">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Ürün Özellikleri</h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="attr in product.attributes" :key="attr.code">
            <p class="text-xs text-gray-500 mb-1">{{ attr.name }}</p>
            <p class="text-sm font-medium text-gray-900">{{ attr.value }}</p>
          </div>
        </div>
      </div>

      <!-- Varyantlar (Variants) -->
      <div v-if="product.variants && product.variants.length > 0">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Varyantlar</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beden</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renk</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="variant in product.variants" :key="variant.id">
                <td class="px-3 py-2 text-sm text-gray-900">{{ variant.sku }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ variant.size || '—' }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ variant.color || '—' }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ formatCurrency(variant.price) }}</td>
                <td class="px-3 py-2 text-sm text-gray-900">{{ variant.stock }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Beden / Renk (Simplified - shows unique sizes) -->
      <div v-if="product.sizes && product.sizes.length > 0">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Mevcut Bedenler</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="size in product.sizes"
            :key="size"
            class="px-2 py-1 text-xs bg-gray-100 rounded text-gray-700"
          >
            {{ size }}
          </span>
        </div>
      </div>

      <!-- Satış -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Satış</h3>
        <div class="space-y-3">
          <div>
            <p class="text-xs text-gray-500 mb-1">Fiyat</p>
            <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(product.price) }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">Stok</p>
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-gray-900">{{ product.stock }} adet</p>
              <LowStockBadge :stock="product.stock" :threshold="product.lowStockThreshold" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <UiButton variant="ghost" @click="$emit('close')">Kapat</UiButton>
        <UiButton
          v-if="product"
          variant="primary"
          @click="handleEdit"
        >
          Düzenle
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiModal from '@admin/components/ui/UiModal.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiBadge from '@admin/components/ui/UiBadge.vue'
import LowStockBadge from './LowStockBadge.vue'
import ProductAvailabilityBadge from './ProductAvailabilityBadge.vue' // Ensure this exists or imported correctly
import { formatCurrency } from '@admin/lib/format'
import type { Product } from '../types'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
  product?: Product
}>()

const emit = defineEmits<{
  close: []
}>()

function handleEdit() {
  if (props.product) {
    router.push({ name: 'product-edit', params: { id: props.product.id } })
  }
}

function formatCategory(category?: string): string {
  if (!category) return '—'
  const categoryMap: Record<string, string> = {
    bridal: 'Gelinlik',
    evening: 'Gece',
    accessory: 'Aksesuar',
    gelinlik: 'Gelinlik',
  }
  return categoryMap[category] || category
}
</script>
