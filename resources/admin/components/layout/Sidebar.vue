<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 z-40 shadow-xl',
      isMobile 
        ? (isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full') 
        : (isOpen ? 'w-64' : 'w-16'),
    ]"
  >
    <div class="flex h-full flex-col">
      <!-- Premium Brand Header -->
      <div class="flex h-20 items-center px-4 border-b border-slate-700/50">
        <div v-if="isOpen || isMobile" class="flex items-center gap-3 w-full">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg flex-shrink-0">
            GD
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-sm font-semibold text-white truncate">Gelinlik Dünyası</h1>
            <p class="text-xs text-slate-400 truncate">Yönetim Paneli • Atölye • Sipariş • Stok</p>
          </div>
        </div>
        <div v-else class="flex items-center justify-center w-full">
          <div class="h-10 w-10 rounded-full bg-gradient-to-br from-rose-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
            GD
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-3">
        <template v-for="item in menuItems" :key="item.path">
          <!-- Regular menu item -->
          <router-link
            v-if="!item.children"
            :to="item.name ? { name: item.name } : (item.path || '/')"
            :class="[
              'group mb-1.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isItemActive(item)
                ? 'bg-white/10 text-white shadow-sm border-l-2 border-rose-400'
                : 'text-slate-300 hover:bg-white/5 hover:text-white',
            ]"
            @click="handleMenuClick"
          >
            <span
              :class="[
                'text-lg transition-opacity',
                isItemActive(item) ? 'opacity-100' : 'opacity-70 group-hover:opacity-100',
              ]"
            >
              {{ item.icon }}
            </span>
            <span v-if="isOpen || isMobile" class="flex-1 truncate">{{ item.label }}</span>
          </router-link>
          <!-- Menu item with submenu -->
          <div v-else class="mb-1.5">
            <div
              :class="[
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer',
                isItemActive(item) || isAnyChildActive(item.children)
                  ? 'bg-white/10 text-white shadow-sm border-l-2 border-rose-400'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              ]"
            >
              <span
                :class="[
                  'text-lg transition-opacity',
                  isItemActive(item) || isAnyChildActive(item.children)
                    ? 'opacity-100'
                    : 'opacity-70 group-hover:opacity-100',
                ]"
              >
                {{ item.icon }}
              </span>
              <span v-if="isOpen || isMobile" class="flex-1 truncate">{{ item.label }}</span>
            </div>
            <!-- Submenu items -->
            <div v-if="isOpen || isMobile" class="ml-8 mt-1 space-y-1">
              <router-link
                v-for="child in item.children"
                :key="child.path || child.name"
                :to="child.name ? { name: child.name } : (child.path || '/')"
                :class="[
                  'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  isChildActive(child)
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-300',
                ]"
                @click="handleMenuClick"
              >
                <span class="w-1 h-1 rounded-full bg-current opacity-50"></span>
                <span>{{ child.label }}</span>
              </router-link>
            </div>
          </div>
        </template>
      </nav>

      <!-- Footer -->
      <div v-if="isOpen || isMobile" class="px-4 py-3 border-t border-slate-700/50">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>v1.0</span>
          <div class="flex items-center gap-1.5">
            <div class="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>Online</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@admin/stores/auth'
import type { Permission } from '@admin/lib/auth/types'

const props = defineProps<{
  isOpen: boolean
  isMobile?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const $route = useRoute()
const authStore = useAuthStore()

interface MenuItemChild {
  path?: string
  name?: string
  label: string
}

interface MenuItem {
  path?: string
  name?: string
  label: string
  icon: string
  permission: Permission
  children?: MenuItemChild[]
}

const allMenuItems: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: '📊', permission: 'analytics.read' as Permission },
  { name: 'orders', label: 'Siparişler', icon: '📦', permission: 'orders.read' as Permission },
  { name: 'fulfillment', label: 'Sevkiyat', icon: '🚚', permission: 'fulfillment.read' as Permission },
  {
    path: '/products',
    label: 'Ürünler',
    icon: '👗',
    permission: 'products.read' as Permission,
    children: [
      { name: 'products', label: 'Ürün Listesi' },
      { name: 'product-create', label: 'Ürün Ekle' },
    ],
  },
  {
    path: '/customers/individual',
    label: 'Müşteriler',
    icon: '👥',
    permission: 'customers.read' as Permission,
    children: [
      { name: 'customers-individual', label: 'Bireysel' },
      { name: 'customers-company', label: 'Şirket' },
    ],
  },
  { name: 'sellers', label: 'Satıcılar', icon: '🏪', permission: 'sellers.read' as Permission },
  {
    path: '/stores',
    label: 'Mağazalar',
    icon: '🏬',
    permission: 'stores.read' as Permission,
    children: [
      { name: 'stores', label: 'Mağaza Listesi' },
      { name: 'store-create', label: 'Mağaza Ekle' },
    ],
  },
  { name: 'settings-home-video', label: 'Ana Sayfa Vitrin', icon: '🎬', permission: 'stores.write' as Permission },
  { name: 'banners', label: 'Kayan Yazılar', icon: '📢', permission: 'stores.write' as Permission },
  { name: 'analytics', label: 'Analitik', icon: '📈', permission: 'analytics.read' as Permission },
  { name: 'settings', label: 'Ayarlar', icon: '⚙️', permission: 'settings.read' as Permission },
]

// Filter menu items based on permissions
const menuItems = computed(() => {
  return allMenuItems.filter((item) => authStore.hasPermission(item.permission))
})

function isItemActive(item: MenuItem): boolean {
  if (item.name) {
    // Seller detail ve seller-products sayfalarında "Satıcılar" menüsü aktif kalmalı
    if (item.name === 'sellers') {
      return (
        $route.name === 'sellers' ||
        $route.name === 'seller-detail' ||
        $route.name === 'seller-products'
      )
    }
    return $route.name === item.name
  }
  if (item.path) {
    // Products ve Stores için alt menüler aktif olduğunda parent da aktif olmalı
    if (item.path === '/products') {
      return (
        $route.path === '/products' ||
        $route.path.startsWith('/products/') ||
        $route.name === 'products' ||
        $route.name === 'product-create' ||
        $route.name === 'product-edit'
      )
    }
    if (item.path === '/stores') {
      return (
        $route.path === '/stores' ||
        $route.path.startsWith('/stores/') ||
        $route.name === 'stores' ||
        $route.name === 'store-create' ||
        $route.name === 'store-edit'
      )
    }
    return $route.path === item.path || $route.path.startsWith(item.path + '/')
  }
  return false
}

function isChildActive(child: MenuItemChild): boolean {
  if (child.name) {
    return $route.name === child.name
  }
  if (child.path) {
    return $route.path === child.path || $route.path.startsWith(child.path + '/')
  }
  return false
}

function isAnyChildActive(children?: MenuItemChild[]): boolean {
  if (!children) return false
  return children.some((child) => isChildActive(child))
}

// Handle menu item click - close sidebar if on mobile
function handleMenuClick() {
  if (props.isMobile) {
    emit('close')
  }
}
</script>
