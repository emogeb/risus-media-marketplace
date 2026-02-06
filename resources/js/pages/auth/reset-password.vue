<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { ensureCsrfCookie } from '@/lib/csrf';

interface Props {
  email: string;
  token: string;
}

const props = defineProps<Props>();

const processing = ref(false);
const form = ref({
  token: props.token,
  email: props.email,
  password: '',
  password_confirmation: '',
});

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
    router.post('/reset-password', form.value, {
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
  <Head title="Şifre sıfırla" />
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">Yeni şifre belirle</h1>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <input v-model="form.token" type="hidden" />
          <input v-model="form.email" type="hidden" />
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Yeni şifre</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
          </div>
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Şifre (tekrar)</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-600">{{ errors.password_confirmation }}</p>
          </div>
          <button
            type="submit"
            :disabled="processing"
            class="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
          >
            {{ processing ? 'Kaydediliyor…' : 'Şifreyi sıfırla' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
