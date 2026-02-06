<script setup lang="ts">
import { ref } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import { ensureCsrfCookie } from '@/lib/csrf';

interface Props {
  twoFactorEnabled: boolean;
  requiresConfirmation: boolean;
}

const props = defineProps<Props>();

const processing = ref(false);
const recoveryCodes = ref<string[]>([]);
const showCodes = ref(false);

async function enable() {
  processing.value = true;
  try {
    await ensureCsrfCookie();
    router.post('/user/two-factor-authentication', {}, {
      preserveScroll: true,
      onFinish: () => { processing.value = false; },
    });
  } catch {
    processing.value = false;
  }
}

async function disable() {
  if (!confirm('İki adımlı doğrulama kapatılacak. Devam edilsin mi?')) return;
  processing.value = true;
  try {
    await ensureCsrfCookie();
    router.delete('/user/two-factor-authentication', {
      preserveScroll: true,
      onFinish: () => { processing.value = false; },
    });
  } catch {
    processing.value = false;
  }
}

async function fetchRecoveryCodes() {
  processing.value = true;
  try {
    await ensureCsrfCookie();
    const res = await fetch('/user/two-factor-recovery-codes', { credentials: 'include', headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' } });
    const data = await res.json();
    recoveryCodes.value = data.recovery_codes ?? [];
    showCodes.value = true;
  } finally {
    processing.value = false;
  }
}

async function regenerateRecoveryCodes() {
  if (!confirm('Yeni kurtarma kodları oluşturulacak; eskiler geçersiz olacak. Devam?')) return;
  processing.value = true;
  try {
    await ensureCsrfCookie();
    router.post('/user/two-factor-recovery-codes', {}, {
      preserveScroll: true,
      onSuccess: () => { recoveryCodes.value = []; showCodes.value = false; },
      onFinish: () => { processing.value = false; },
    });
  } catch {
    processing.value = false;
  }
}

</script>

<template>
  <Head title="İki adımlı doğrulama" />
  <div class="mx-auto max-w-2xl space-y-8 px-4 py-12">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">İki adımlı doğrulama</h1>
      <p class="mt-1 text-sm text-gray-600">Hesabınızı ek güvenlik ile koruyun.</p>
    </div>

    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div v-if="!twoFactorEnabled" class="space-y-4">
        <p class="text-sm text-gray-600">İki adımlı doğrulama kapalı.</p>
        <button
          type="button"
          :disabled="processing"
          class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70"
          @click="enable"
        >
          {{ processing ? 'Açılıyor…' : 'İki adımlı doğrulamayı aç' }}
        </button>
      </div>

      <div v-else class="space-y-4">
        <p class="text-sm text-green-600">İki adımlı doğrulama açık.</p>
        <button
          type="button"
          :disabled="processing"
          class="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-70"
          @click="disable"
        >
          {{ processing ? 'Kapatılıyor…' : 'İki adımlı doğrulamayı kapat' }}
        </button>
        <div class="border-t border-gray-200 pt-4">
          <p class="text-sm font-medium text-gray-700">Kurtarma kodları</p>
          <p class="mt-1 text-xs text-gray-500">Kaybolursanız giriş için kurtarma kodu kullanabilirsiniz.</p>
          <button
            type="button"
            :disabled="processing"
            class="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-70"
            @click="fetchRecoveryCodes"
          >
            Kodları göster
          </button>
          <button
            type="button"
            :disabled="processing"
            class="ml-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-70"
            @click="regenerateRecoveryCodes"
          >
            Yeni kodlar oluştur
          </button>
          <div v-if="showCodes && recoveryCodes.length" class="mt-4 rounded-lg bg-gray-50 p-4 font-mono text-xs">
            <p class="mb-2 font-sans font-medium text-gray-700">Bu kodları güvenli saklayın.</p>
            <ul class="space-y-1">
              <li v-for="(c, i) in recoveryCodes" :key="i">{{ c }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <p>
      <Link href="/settings/profile" class="text-sm text-gray-600 hover:text-gray-900">← Ayarlara dön</Link>
    </p>
  </div>
</template>
