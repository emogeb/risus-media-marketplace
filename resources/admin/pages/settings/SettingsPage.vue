<template>
  <div class="space-y-6">
    <PageHeader title="Ayarlar" description="Sistem ayarlarını yönetin" />
    <UiCard>
      <p class="text-gray-600 mb-4">Ayarlar sayfası yakında eklenecek</p>
      <div class="space-y-4">
        <router-link
          v-if="isDev"
          to="/settings/integration-test"
          class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Integration Test (DEV only)
        </router-link>
        <div v-if="isDev" class="pt-4 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Role Switch (DEV only)</h3>
          <div class="flex gap-2">
            <UiButton
              :variant="authStore.role === 'admin' ? 'primary' : 'ghost'"
              size="sm"
              @click="authStore.setRole('admin')"
            >
              Admin
            </UiButton>
            <UiButton
              :variant="authStore.role === 'staff' ? 'primary' : 'ghost'"
              size="sm"
              @click="authStore.setRole('staff')"
            >
              Staff
            </UiButton>
            <UiButton
              :variant="authStore.role === 'viewer' ? 'primary' : 'ghost'"
              size="sm"
              @click="authStore.setRole('viewer')"
            >
              Viewer
            </UiButton>
          </div>
          <p class="text-xs text-gray-500 mt-2">Current role: {{ authStore.role }}</p>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { useAuthStore } from '@admin/stores/auth'

const isDev = computed(() => import.meta.env.DEV)
const authStore = useAuthStore()
</script>
