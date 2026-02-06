<template>
  <UiModal :model-value="isOpen" @update:model-value="$emit('close')">
    <template #header>
      <h2 class="text-xl font-bold">Stok Düzenle</h2>
    </template>
    <div v-if="product" class="space-y-4">
      <div>
        <p class="text-sm text-gray-600 mb-1">Ürün</p>
        <p class="font-medium">{{ product.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Stok</label>
        <input
          v-model.number="newStock"
          type="number"
          min="0"
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
    <template #footer>
      <UiButton variant="ghost" @click="$emit('close')">İptal</UiButton>
      <UiButton @click="handleSave" :disabled="isSaving">Kaydet</UiButton>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import UiModal from '@admin/components/ui/UiModal.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { useProductMutations } from '../composables/useProductMutations'
import type { Product } from '../types'

const props = defineProps<{
  isOpen: boolean
  product?: Product
}>()

const emit = defineEmits<{
  close: []
}>()

const newStock = ref(0)
const { updateStock } = useProductMutations()
const isSaving = computed(() => updateStock.isPending.value)

watch(() => props.product, (product) => {
  if (product) {
    newStock.value = product.stock
  }
}, { immediate: true })

function handleSave() {
  if (props.product) {
    updateStock.mutate(
      { id: props.product.id, stock: newStock.value },
      {
        onSuccess: () => {
          emit('close')
        },
      }
    )
  }
}
</script>
