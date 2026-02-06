<!-- resources/js/components/profile/AddressCard.vue -->
<script setup lang="ts">
import { MapPin, Phone, Edit, Trash2, Star, Home, Briefcase } from 'lucide-vue-next';
import type { Address } from '@/types/profile';

const props = defineProps<{
  address: Address;
  loading?: boolean;
}>();

const emit = defineEmits<{
  edit: [address: Address];
  delete: [addressId: number];
  'set-default': [addressId: number];
}>();
</script>

<template>
  <div
    :class="[
      'group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-all',
      address.is_default ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-200 hover:shadow-md'
    ]"
  >
    <!-- Default Badge -->
    <div
      v-if="address.is_default"
      class="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-black px-3 py-1.5 text-xs font-medium text-white"
    >
      <Star :size="14" class="fill-white" />
      Varsayılan
    </div>

    <!-- Header -->
    <div class="mb-4 flex items-start justify-between">
      <div class="flex-1">
        <div class="mb-2 flex items-center gap-2">
          <component 
            :is="address.title?.toLowerCase().includes('iş') ? Briefcase : Home" 
            :size="18" 
            class="text-gray-600" 
          />
          <h3 class="font-bold text-gray-900">{{ address.title || 'Adres' }}</h3>
        </div>
        <div class="text-sm font-medium text-gray-700">{{ address.full_name }}</div>
      </div>
    </div>

    <!-- Address Details -->
    <div class="mb-4 space-y-1 text-sm text-gray-600">
      <p class="leading-relaxed">{{ address.address_line }}</p>
      <p v-if="address.neighborhood">{{ address.neighborhood }} Mah.</p>
      <p>{{ address.district }} / {{ address.city }}</p>
      <p v-if="address.postal_code" class="text-xs text-gray-400">{{ address.postal_code }}</p>
      
      <div v-if="address.phone" class="flex items-center gap-2 pt-2 text-gray-700">
        <Phone :size="14" />
        <span>{{ address.phone }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-2 pt-2">
      <button
        v-if="!address.is_default"
        @click="emit('set-default', address.id)"
        :disabled="loading"
        class="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
      >
        <Star :size="14" />
        Varsayılan Yap
      </button>

      <button
        @click="emit('edit', address)"
        :disabled="loading"
        class="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
      >
        <Edit :size="14" />
        Düzenle
      </button>

      <button
        @click="emit('delete', address.id)"
        :disabled="loading || address.is_default"
        class="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-700 transition-all hover:bg-red-50 disabled:opacity-50"
        :title="address.is_default ? 'Varsayılan adres silinemez' : ''"
      >
        <Trash2 :size="14" />
        Sil
      </button>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/80"
    >
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
    </div>
  </div>
</template>
