<template>
  <div class="space-y-6">
    <PageHeader title="Integration Test" description="API endpoint'lerini test edin (DEV only)" />
    
    <UiCard>
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Use Mocks:</span>
          <span :class="configInfo.useMocks ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
            {{ configInfo.useMocks ? 'true' : 'false' }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">API Base URL:</span>
          <span class="text-gray-900 font-mono text-xs">{{ configInfo.apiBaseUrl }}</span>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs font-medium text-gray-700 mb-2">Environment Debug:</p>
          <pre class="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32 font-mono">{{ JSON.stringify(envDebug, null, 2) }}</pre>
        </div>
      </div>
    </UiCard>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <UiCard>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Test Butonları</h3>
        <div class="space-y-3">
          <UiButton
            :disabled="loading.dashboard"
            @click="testDashboard"
            class="w-full"
          >
            {{ loading.dashboard ? 'Testing...' : 'Test Dashboard Summary' }}
          </UiButton>
          <UiButton
            :disabled="loading.orders"
            @click="testOrders"
            class="w-full"
          >
            {{ loading.orders ? 'Testing...' : 'Test Orders List' }}
          </UiButton>
          <UiButton
            :disabled="loading.products"
            @click="testProducts"
            class="w-full"
          >
            {{ loading.products ? 'Testing...' : 'Test Products' }}
          </UiButton>
          <UiButton
            :disabled="loading.customers"
            @click="testCustomers"
            class="w-full"
          >
            {{ loading.customers ? 'Testing...' : 'Test Customers' }}
          </UiButton>
        </div>
      </UiCard>

      <UiCard>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Test Sonuçları</h3>
        <div class="space-y-4">
          <!-- Dashboard Result -->
          <div v-if="results.dashboard">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Dashboard Summary</h4>
            <div v-if="loading.dashboard" class="h-32">
              <UiSkeleton height="h-32" />
            </div>
            <div v-else-if="results.dashboard.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm font-medium text-red-800">
                {{ results.dashboard.error.status === 0 ? 'Network Error' : `Error ${results.dashboard.error.status}` }}
              </p>
              <p class="text-sm text-red-600 mt-1">{{ results.dashboard.error.message }}</p>
              <div v-if="results.dashboard.error.isHtml" class="mt-3 pt-3 border-t border-red-200">
                <p class="text-xs text-red-700 font-medium mb-1">Configuration:</p>
                <p class="text-xs text-red-600">API Base URL: {{ configInfo.apiBaseUrl }}</p>
                <p class="text-xs text-red-600">Use Mocks: {{ configInfo.useMocks ? 'true' : 'false' }}</p>
              </div>
            </div>
            <div v-else class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <pre class="text-xs overflow-auto max-h-64">{{ JSON.stringify(results.dashboard.data, null, 2) }}</pre>
            </div>
          </div>

          <!-- Orders Result -->
          <div v-if="results.orders">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Orders List</h4>
            <div v-if="loading.orders" class="h-32">
              <UiSkeleton height="h-32" />
            </div>
            <div v-else-if="results.orders.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm font-medium text-red-800">
                {{ results.orders.error.status === 0 ? 'Network Error' : `Error ${results.orders.error.status}` }}
              </p>
              <p class="text-sm text-red-600 mt-1">{{ results.orders.error.message }}</p>
              <div v-if="results.orders.error.isHtml" class="mt-3 pt-3 border-t border-red-200">
                <p class="text-xs text-red-700 font-medium mb-1">Configuration:</p>
                <p class="text-xs text-red-600">API Base URL: {{ configInfo.apiBaseUrl }}</p>
                <p class="text-xs text-red-600">Use Mocks: {{ configInfo.useMocks ? 'true' : 'false' }}</p>
              </div>
            </div>
            <div v-else class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <pre class="text-xs overflow-auto max-h-64">{{ JSON.stringify(results.orders.data, null, 2) }}</pre>
            </div>
          </div>

          <!-- Products Result -->
          <div v-if="results.products">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Products</h4>
            <div v-if="loading.products" class="h-32">
              <UiSkeleton height="h-32" />
            </div>
            <div v-else-if="results.products.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm font-medium text-red-800">
                {{ results.products.error.status === 0 ? 'Network Error' : `Error ${results.products.error.status}` }}
              </p>
              <p class="text-sm text-red-600 mt-1">{{ results.products.error.message }}</p>
              <div v-if="results.products.error.isHtml" class="mt-3 pt-3 border-t border-red-200">
                <p class="text-xs text-red-700 font-medium mb-1">Configuration:</p>
                <p class="text-xs text-red-600">API Base URL: {{ configInfo.apiBaseUrl }}</p>
                <p class="text-xs text-red-600">Use Mocks: {{ configInfo.useMocks ? 'true' : 'false' }}</p>
              </div>
            </div>
            <div v-else class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <pre class="text-xs overflow-auto max-h-64">{{ JSON.stringify(results.products.data, null, 2) }}</pre>
            </div>
          </div>

          <!-- Customers Result -->
          <div v-if="results.customers">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Customers</h4>
            <div v-if="loading.customers" class="h-32">
              <UiSkeleton height="h-32" />
            </div>
            <div v-else-if="results.customers.error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm font-medium text-red-800">
                {{ results.customers.error.status === 0 ? 'Network Error' : `Error ${results.customers.error.status}` }}
              </p>
              <p class="text-sm text-red-600 mt-1">{{ results.customers.error.message }}</p>
              <div v-if="results.customers.error.isHtml" class="mt-3 pt-3 border-t border-red-200">
                <p class="text-xs text-red-700 font-medium mb-1">Configuration:</p>
                <p class="text-xs text-red-600">API Base URL: {{ configInfo.apiBaseUrl }}</p>
                <p class="text-xs text-red-600">Use Mocks: {{ configInfo.useMocks ? 'true' : 'false' }}</p>
              </div>
            </div>
            <div v-else class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <pre class="text-xs overflow-auto max-h-64">{{ JSON.stringify(results.customers.data, null, 2) }}</pre>
            </div>
          </div>

          <div v-if="!results.dashboard && !results.orders && !results.products && !results.customers" class="text-center text-gray-500 py-8">
            <p>Test butonlarına tıklayarak API endpoint'lerini test edin</p>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from '@admin/components/layout/PageHeader.vue'
import UiCard from '@admin/components/ui/UiCard.vue'
import UiButton from '@admin/components/ui/UiButton.vue'
import UiSkeleton from '@admin/components/ui/UiSkeleton.vue'
import { getDashboardSummary } from '@admin/features/dashboard/api/dashboard.api'
import { getOrders } from '@admin/features/orders/api/orders.api'
import { getProducts } from '@admin/features/products/api/products.api'
import { getCustomers } from '@admin/features/customers/api/customers.api'
import { apiBaseUrl, useMocks, envDebug } from '@admin/lib/integration'

function isHtmlResponse(data: unknown): boolean {
  if (typeof data !== 'string') return false
  const lower = data.toLowerCase().trim()
  return lower.includes('<!doctype html') || lower.includes('<html')
}

function formatError(error: any): { status: number; message: string } {
  if (error.response) {
    const status = error.response.status
    const responseData = error.response.data
    
    // Check if response is HTML
    if (typeof responseData === 'string' && isHtmlResponse(responseData)) {
      return {
        status,
        message: `API JSON yerine HTML döndürdü. VITE_API_BASE_URL yanlış olabilir veya MSW kapalı olabilir.`,
      }
    }
    
    const message = responseData?.message || responseData?.error || 'Unknown error'
    return { status, message }
  }
  
  // Network error or other
  if (error.message?.includes('Expected JSON object but received string/HTML')) {
    return {
      status: 0,
      message: error.message,
    }
  }
  
  return {
    status: 0,
    message: error.message || 'Network error - no response',
  }
}

const loading = ref({
  dashboard: false,
  orders: false,
  products: false,
  customers: false,
})

const results = ref<{
  dashboard?: { data?: unknown; error?: { status: number; message: string; isHtml?: boolean } }
  orders?: { data?: unknown; error?: { status: number; message: string; isHtml?: boolean } }
  products?: { data?: unknown; error?: { status: number; message: string; isHtml?: boolean } }
  customers?: { data?: unknown; error?: { status: number; message: string; isHtml?: boolean } }
}>({})

const configInfo = computed(() => ({
  apiBaseUrl,
  useMocks,
}))

async function testDashboard() {
  loading.value.dashboard = true
  results.value.dashboard = undefined
  
  try {
    const data = await getDashboardSummary()
    
    // Check if response is HTML
    if (typeof data === 'string' && isHtmlResponse(data)) {
      results.value.dashboard = {
        error: {
          status: 200,
          message: 'API JSON yerine HTML döndürdü. VITE_API_BASE_URL yanlış olabilir veya MSW kapalı olabilir.',
          isHtml: true,
        },
      }
      return
    }
    
    results.value.dashboard = { data }
  } catch (error: any) {
    results.value.dashboard = { error: formatError(error) }
  } finally {
    loading.value.dashboard = false
  }
}

async function testOrders() {
  loading.value.orders = true
  results.value.orders = undefined
  
  try {
    const data = await getOrders({ page: 1, pageSize: 5 })
    
    if (typeof data === 'string' && isHtmlResponse(data)) {
      results.value.orders = {
        error: {
          status: 200,
          message: 'API JSON yerine HTML döndürdü. VITE_API_BASE_URL yanlış olabilir veya MSW kapalı olabilir.',
          isHtml: true,
        },
      }
      return
    }
    
    results.value.orders = { data }
  } catch (error: any) {
    results.value.orders = { error: formatError(error) }
  } finally {
    loading.value.orders = false
  }
}

async function testProducts() {
  loading.value.products = true
  results.value.products = undefined
  
  try {
    const data = await getProducts()
    
    if (typeof data === 'string' && isHtmlResponse(data)) {
      results.value.products = {
        error: {
          status: 200,
          message: 'API JSON yerine HTML döndürdü. VITE_API_BASE_URL yanlış olabilir veya MSW kapalı olabilir.',
          isHtml: true,
        },
      }
      return
    }
    
    results.value.products = { data }
  } catch (error: any) {
    results.value.products = { error: formatError(error) }
  } finally {
    loading.value.products = false
  }
}

async function testCustomers() {
  loading.value.customers = true
  results.value.customers = undefined
  
  try {
    const data = await getCustomers()
    
    if (typeof data === 'string' && isHtmlResponse(data)) {
      results.value.customers = {
        error: {
          status: 200,
          message: 'API JSON yerine HTML döndürdü. VITE_API_BASE_URL yanlış olabilir veya MSW kapalı olabilir.',
          isHtml: true,
        },
      }
      return
    }
    
    results.value.customers = { data }
  } catch (error: any) {
    results.value.customers = { error: formatError(error) }
  } finally {
    loading.value.customers = false
  }
}
</script>
