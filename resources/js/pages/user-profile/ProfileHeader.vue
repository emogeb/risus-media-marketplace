<!-- resources/js/components/profile/ProfileHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Calendar, Mail, Shield } from 'lucide-vue-next';
import type { User } from '@/types/profile';

const props = defineProps<{
  user: User;
}>();

const memberSince = computed(() => {
  const date = new Date(props.user.created_at);
  return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' });
});

const userTypeLabel = computed(() => {
  const labels = {
    admin: 'Yönetici',
    vendor: 'Satıcı',
    customer: 'Müşteri'
  };
  return labels[props.user.type] || props.user.type;
});

const userTypeBadgeColor = computed(() => {
  const colors = {
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
    vendor: 'bg-blue-100 text-blue-800 border-blue-200',
    customer: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[props.user.type] || 'bg-gray-100 text-gray-800 border-gray-200';
});
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="flex flex-col items-center gap-6 md:flex-row md:items-start">
      <!-- Avatar Slot -->
      <div class="flex-shrink-0">
        <slot name="avatar" />
      </div>

      <!-- User Info -->
      <div class="flex-1 text-center md:text-left">
        <div class="mb-2 flex flex-col items-center gap-2 md:flex-row md:items-center">
          <h1 class="text-2xl font-bold text-gray-900">{{ user.name }}</h1>
          <span
            :class="[
              'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium',
              userTypeBadgeColor
            ]"
          >
            <Shield :size="14" />
            {{ userTypeLabel }}
          </span>
        </div>

        <div class="space-y-2">
          <!-- Email -->
          <div class="flex items-center justify-center gap-2 text-gray-600 md:justify-start">
            <Mail :size="16" />
            <span class="text-sm">{{ user.email }}</span>
            <span
              v-if="user.email_verified_at"
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
            >
              Doğrulandı
            </span>
            <span
              v-else
              class="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800"
            >
              Doğrulanmadı
            </span>
          </div>

          <!-- Member Since -->
          <div class="flex items-center justify-center gap-2 text-gray-600 md:justify-start">
            <Calendar :size="16" />
            <span class="text-sm">Üyelik: {{ memberSince }}</span>
          </div>
        </div>
      </div>

      <!-- Actions Slot -->
      <div class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
