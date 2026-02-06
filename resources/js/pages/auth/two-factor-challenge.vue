<script setup lang="ts">
import { ref } from 'vue';
import { Head, router } from '@inertiajs/vue3';
import { ensureCsrfCookie } from '@/lib/csrf';

const processing = ref(false);
const mode = ref<'code' | 'recovery'>('code');
const form = ref({
  code: '',
  recovery_code: '',
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
    const payload = mode.value === 'code'
      ? { code: form.value.code }
      : { recovery_code: form.value.recovery_code };
    router.post('/two-factor-challenge', payload, {
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
  <Head title="İki adımlı doğrulama" />
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-gray-900">İki adımlı doğrulama</h1>
        <div class="mt-4 flex gap-2">
          <button
            type="button"
            :class="['rounded-lg px-3 py-1.5 text-sm font-medium', mode === 'code' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700']"
            @click="mode = 'code'"
          >
            OTP
          </button>
          <button
            type="button"
            :class="['rounded-lg px-3 py-1.5 text-sm font-medium', mode === 'recovery' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700']"
            @click="mode = 'recovery'"
          >
            Kurtarma kodu
          </button>
        </div>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div v-if="mode === 'code'">
            <label for="code" class="block text-sm font-medium text-gray-700">Doğrulama kodu</label>
            <input
              id="code"
              v-model="form.code"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.code" class="mt-1 text-xs text-red-600">{{ errors.code }}</p>
          </div>
          <div v-else>
            <label for="recovery_code" class="block text-sm font-medium text-gray-700">Kurtarma kodu</label>
            <input
              id="recovery_code"
              v-model="form.recovery_code"
              type="text"
              autocomplete="off"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.recovery_code" class="mt-1 text-xs text-red-600">{{ errors.recovery_code }}</p>
          </div>
          <button
            type="submit"
            :disabled="processing"
            class="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
          >
            {{ processing ? 'Doğrulanıyor…' : 'Doğrula' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
