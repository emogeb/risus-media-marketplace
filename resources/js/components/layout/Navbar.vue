<script setup lang="ts">
import { Link, usePage, router } from '@inertiajs/vue3';
import Button from '@/components/ui/Button.vue';
import ToastContainer from '@/components/ui/ToastContainer.vue';
import { useT } from '@/composables/useT';

const { t } = useT();

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const props = withDefaults(defineProps<{
  brandName?: string;
  transparent?: boolean;
}>(), {
  brandName: 'Risus Media',
  transparent: false,
});

const page = usePage<any>();
const authUser = page.props.auth?.user ?? null;

const navItems: NavItem[] = [
  { label: 'nav.home', href: '/' },
  { label: 'nav.collections', href: '/collections' },
  { label: 'nav.stores', href: '/stores' },
];

function logout() {
  router.post('/logout');
}
</script>

<template>
  <header class="relative z-10">
    <div class="mx-auto max-w-6xl px-6 pt-6">
      <div 
        :class="[
          'flex items-center justify-between rounded-2xl px-6 py-4 transition-all',
          transparent 
            ? 'border border-white/15 bg-white/10 backdrop-blur-md' 
            : 'border border-gray-200 bg-white shadow-sm'
        ]"
      >
        <!-- Brand -->
        <Link 
          href="/" 
          class="transition-opacity hover:opacity-80"
        >
          <img 
            v-if="transparent"
            src="/risuslogo_page-0001-Photoroom.png" 
            alt="Risus Media" 
            class="h-10 w-auto brightness-0 invert" 
          />
          <img 
            v-else
            src="/risuslogo_page-0001-Photoroom.png" 
            alt="Risus Media" 
            class="h-10 w-auto" 
          />
        </Link>

        <!-- Desktop Navigation -->
        <nav class="hidden items-center gap-8 md:flex">
          <Link
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            :class="[
              'text-sm font-medium transition-colors',
              transparent 
                ? 'text-white/85 hover:text-white' 
                : 'text-gray-700 hover:text-gray-900',
              $page.url === item.href && 'font-semibold'
            ]"
          >
            {{ t(item.label) }}
          </Link>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <template v-if="authUser">
            <Link
              v-if="authUser.type === 'admin'"
              href="/admin"
              :class="[
                'hidden rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 md:inline-block',
                transparent ? 'bg-white text-black hover:bg-white/90' : ''
              ]"
            >
              {{ t('nav.admin_panel') }}
            </Link>
            <Link
              href="/settings/profile"
              :class="[
                'hidden rounded-lg px-3 py-1.5 text-sm font-medium md:inline-block',
                transparent ? 'text-white/85 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              ]"
            >
              {{ t('profile.my_profile') }}
            </Link>
            <button
              type="button"
              :class="[
                'hidden rounded-lg px-3 py-1.5 text-sm font-medium md:inline-block',
                transparent ? 'text-white/85 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              ]"
              @click="logout"
            >
              {{ t('auth.logout') }}
            </button>
          </template>
          <template v-else>
            <Link
              href="/login"
              :class="[
                'hidden text-sm font-medium md:inline-block',
                transparent ? 'text-white/85 hover:text-white' : 'text-gray-700 hover:text-gray-900'
              ]"
            >
              {{ t('auth.login') }}
            </Link>
            <Link
              href="/register"
              :class="[
                'hidden rounded-lg border px-3 py-1.5 text-sm font-medium md:inline-block',
                transparent ? 'border-white/70 text-white hover:bg-white hover:text-black' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              ]"
            >
              {{ t('auth.register') }}
            </Link>
          </template>

          <Button
            variant="ghost"
            size="sm"
            href="/cart"
            :class="[
              transparent 
                ? 'border-white/70 text-white hover:bg-white hover:text-black' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            ]"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span class="ml-2">{{ t('nav.cart') }}</span>
          </Button>

          <!-- Mobile Menu Button -->
          <button
            type="button"
            class="rounded-xl border px-3 py-2 md:hidden"
            :class="transparent ? 'border-white/20 bg-white/10 text-white/90 backdrop-blur-md' : 'border-gray-300 bg-white text-gray-700'"
            aria-label="Open menu"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
  <ToastContainer />
</template>
