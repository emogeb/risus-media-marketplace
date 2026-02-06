<template>
  <UiCard>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.shortcuts.title') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ $t('dashboard.shortcuts.description') }}</p>
      </div>

      <!-- Shortcuts Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Orders -->
        <button
          :disabled="!canAccessOrders"
          :title="!canAccessOrders ? $t('dashboard.shortcuts.noPermission') : ''"
          :class="[
            'group relative flex items-start gap-4 p-4 rounded-lg border transition-all',
            canAccessOrders
              ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white cursor-pointer'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
          ]"
          @click="handleNavigate('orders')"
        >
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              canAccessOrders ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400',
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <h4 class="text-sm font-semibold text-gray-900">{{ $t('dashboard.shortcuts.items.orders.title') }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">{{ $t('dashboard.shortcuts.items.orders.description') }}</p>
          </div>
          <svg
            v-if="canAccessOrders"
            class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Products -->
        <button
          :disabled="!canAccessProducts"
          :title="!canAccessProducts ? $t('dashboard.shortcuts.noPermission') : ''"
          :class="[
            'group relative flex items-start gap-4 p-4 rounded-lg border transition-all',
            canAccessProducts
              ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white cursor-pointer'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
          ]"
          @click="handleNavigate('products')"
        >
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              canAccessProducts ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-400',
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <h4 class="text-sm font-semibold text-gray-900">{{ $t('dashboard.shortcuts.items.products.title') }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">{{ $t('dashboard.shortcuts.items.products.description') }}</p>
          </div>
          <svg
            v-if="canAccessProducts"
            class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Sellers -->
        <button
          :disabled="!canAccessSellers"
          :title="!canAccessSellers ? $t('dashboard.shortcuts.noPermission') : ''"
          :class="[
            'group relative flex items-start gap-4 p-4 rounded-lg border transition-all',
            canAccessSellers
              ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white cursor-pointer'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
          ]"
          @click="handleNavigate('sellers')"
        >
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              canAccessSellers ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400',
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <h4 class="text-sm font-semibold text-gray-900">{{ $t('dashboard.shortcuts.items.sellers.title') }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">{{ $t('dashboard.shortcuts.items.sellers.description') }}</p>
          </div>
          <svg
            v-if="canAccessSellers"
            class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Customers Individual -->
        <button
          :disabled="!canAccessCustomers"
          :title="!canAccessCustomers ? $t('dashboard.shortcuts.noPermission') : ''"
          :class="[
            'group relative flex items-start gap-4 p-4 rounded-lg border transition-all',
            canAccessCustomers
              ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white cursor-pointer'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
          ]"
          @click="handleNavigate('customers-individual')"
        >
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              canAccessCustomers ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-400',
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <h4 class="text-sm font-semibold text-gray-900">
              {{ $t('dashboard.shortcuts.items.customersIndividual.title') }}
            </h4>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ $t('dashboard.shortcuts.items.customersIndividual.description') }}
            </p>
          </div>
          <svg
            v-if="canAccessCustomers"
            class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Customers Company -->
        <button
          :disabled="!canAccessCustomers"
          :title="!canAccessCustomers ? $t('dashboard.shortcuts.noPermission') : ''"
          :class="[
            'group relative flex items-start gap-4 p-4 rounded-lg border transition-all',
            canAccessCustomers
              ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white cursor-pointer'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60',
          ]"
          @click="handleNavigate('customers-company')"
        >
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              canAccessCustomers ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-400',
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="flex-1 min-w-0 text-left">
            <h4 class="text-sm font-semibold text-gray-900">
              {{ $t('dashboard.shortcuts.items.customersCompany.title') }}
            </h4>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ $t('dashboard.shortcuts.items.customersCompany.description') }}
            </p>
          </div>
          <svg
            v-if="canAccessCustomers"
            class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@admin/stores/auth'
import UiCard from '@admin/components/ui/UiCard.vue'

const router = useRouter()
const authStore = useAuthStore()

const canAccessOrders = computed(() => authStore.hasPermission('orders.read'))
const canAccessProducts = computed(() => authStore.hasPermission('products.read'))
const canAccessSellers = computed(() => authStore.hasPermission('sellers.read'))
const canAccessCustomers = computed(() => authStore.hasPermission('customers.read'))

function handleNavigate(routeName: string) {
  router.push({ name: routeName })
}
</script>
