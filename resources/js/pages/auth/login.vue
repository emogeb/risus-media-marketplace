<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, usePage, Link } from '@inertiajs/vue3';
import { ensureCsrfCookie } from '@/lib/csrf';

interface Props {
  canResetPassword?: boolean;
  canRegister?: boolean;
  status?: string;
}

defineProps<Props>();

const page = usePage();
const processing = ref(false);
const form = ref({
  email: '',
  password: '',
  remember: false,
});

const errors = ref<Record<string, string>>({});

function setErrors(err: any) {
  errors.value = Object.fromEntries(
    Object.entries(err as Record<string, any>).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])
  );
}

async function submit() {
  errors.value = {};
  processing.value = true;
  try {
    await ensureCsrfCookie();
    (router as any).post('/login', form.value, {
      preserveScroll: true,
      onError: (e: any) => setErrors(e),
      onFinish: () => { processing.value = false; },
    });
  } catch {
    processing.value = false;
  }
}
</script>

<template>
  <Head title="Giriş" />
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="flex justify-center">
        <Link href="/" class="hover:opacity-80 transition-opacity">
          <img src="/risuslogo_page-0001-Photoroom.png" alt="Risus Media" class="h-12 w-auto" />
        </Link>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-black">Giriş yap</h1>
        <p v-if="status" class="mt-2 text-sm text-green-600">{{ status }}</p>
        <p v-if="(page.props as any).flash?.error" class="mt-2 text-sm text-red-600">{{ (page.props as any).flash.error }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label for="email" class="block text-sm font-medium text-black">E-posta</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-black">Şifre</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
          </div>
          <div class="flex items-center">
            <input
              id="remember"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black bg-white"
            />
            <label for="remember" class="ml-2 text-sm text-black">Beni hatırla</label>
          </div>
          <div class="flex flex-col gap-3">
            <button
              type="submit"
              :disabled="processing"
              class="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
            >
              {{ processing ? 'Giriş yapılıyor…' : 'Giriş yap' }}
            </button>
            <a
              v-if="canResetPassword"
              href="/forgot-password"
              class="text-center text-sm text-black hover:underline"
            >
              Şifremi unuttum
            </a>
          </div>
        </form>

        <!-- Kayıt ol bölümü -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <p class="text-center text-sm text-black">Hesabınız yok mu?</p>
          <a
            href="/register"
            class="mt-2 flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-gray-50"
          >
            Kayıt ol
          </a>
          <div class="mt-6 text-center">
            <a href="/" class="text-sm text-gray-500 hover:text-black hover:underline">
              Ana sayfaya dön
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
