<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, usePage } from '@inertiajs/vue3';
import { ensureCsrfCookie } from '@/lib/csrf';

interface Props {
  status?: string;
}

defineProps<Props>();

const processing = ref(false);
const form = ref({ email: '' });
const errors = ref<Record<string, string>>({});

function setErrors(err: Record<string, string[]>) {
  errors.value = Object.fromEntries(
    Object.entries(err).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])
  );
}

async function submit() {
  errors.value = {};
  processing.value = true;
  try {
    await ensureCsrfCookie();
    router.post('/forgot-password', form.value, {
      preserveScroll: true,
      onError: (e) => setErrors(e as Record<string, string[]>),
      onFinish: () => { processing.value = false; },
    });
  } catch {
    processing.value = false;
  }
}
</script>

<template>
  <Head title="Şifremi unuttum" />
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Şifremi unuttum</h1>
        <p v-if="status" class="mt-2 text-sm text-green-600">{{ status }}</p>
        <p v-if="usePage().props.flash?.error" class="mt-2 text-sm text-red-600">{{ usePage().props.flash?.error }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>
          <div class="flex flex-col gap-3">
            <button
              type="submit"
              :disabled="processing"
              class="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
            >
              {{ processing ? 'Gönderiliyor…' : 'Şifre sıfırlama bağlantısı gönder' }}
            </button>
            <a href="/login" class="text-center text-sm text-gray-600 hover:text-gray-900">
              Girişe dön
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
