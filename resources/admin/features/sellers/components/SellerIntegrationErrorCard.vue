<template>
  <UiCard>
    <div class="flex flex-col items-center justify-center py-12 text-center">
      <svg
        class="w-16 h-16 text-amber-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">API Entegrasyonu Bekleniyor</h3>
      <p class="text-sm text-gray-600 mb-6 max-w-md">
        Laravel API henüz hazır değil veya yapılandırma eksik. Aşağıdaki bilgileri kontrol edin.
      </p>

      <div class="w-full max-w-md space-y-3 text-left">
        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div>
            <p class="text-xs font-medium text-gray-500 mb-1">İstenen Endpoint</p>
            <p class="text-sm text-gray-900 font-mono">{{ endpoint }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 mb-1">Mevcut Base URL</p>
            <p class="text-sm text-gray-900 font-mono">{{ apiBaseUrl }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500 mb-1">VITE_USE_MOCKS</p>
            <p class="text-sm text-gray-900 font-mono">{{ useMocks ? 'true' : 'false' }}</p>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-3 mt-6">
        <UiButton @click="goToIntegrationTest">Integration Test'e Git</UiButton>
        <UiButton variant="ghost" @click="retry">Tekrar Dene</UiButton>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import { apiBaseUrl, useMocks } from '@admin/lib/integration'

defineProps<{
  endpoint: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const router = useRouter()

function goToIntegrationTest() {
  router.push({ name: 'integration-test' })
}

function retry() {
  emit('retry')
}
</script>
