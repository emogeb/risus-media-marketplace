<script setup lang="ts">
import { ref } from 'vue';
import { Head, router, usePage, Link } from '@inertiajs/vue3';
import { ensureCsrfCookie } from '@/lib/csrf';

const processing = ref(false);
const form = ref({
  is_company: false,
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  company_name: '',
  tax_number: '',
  address: '',
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
    (router as any).post('/register', form.value, {
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
  <Head title="Kayıt ol" />
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md space-y-8">
      <div class="flex justify-center">
        <Link href="/" class="hover:opacity-80 transition-opacity">
          <img src="/risuslogo_page-0001-Photoroom.png" alt="Risus Media" class="h-12 w-auto" />
        </Link>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 class="text-2xl font-bold text-black mb-6">Hesap oluştur</h1>
        
        <!-- Registration Type Toggle -->
        <div class="flex p-1 mb-6 bg-gray-100 rounded-lg">
          <button 
            type="button"
            @click="form.is_company = false"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
            :class="!form.is_company ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            Bireysel
          </button>
          <button 
            type="button"
            @click="form.is_company = true"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200"
            :class="form.is_company ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          >
            Kurumsal
          </button>
        </div>

        <p v-if="(usePage().props as any).flash?.error" class="mt-2 text-sm text-red-600">{{ (usePage().props as any).flash?.error }}</p>
        
        <form class="space-y-4" @submit.prevent="submit">
          <!-- Common Fields -->
          <div v-if="!form.is_company">
            <label for="name" class="block text-sm font-medium text-black">Ad Soyad</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Company Specific Fields -->
          <template v-if="form.is_company">
            <div>
              <label for="company_name" class="block text-sm font-medium text-black">Şirket Ünvanı</label>
              <input
                id="company_name"
                v-model="form.company_name"
                type="text"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
              <p v-if="errors.company_name" class="mt-1 text-xs text-red-600">{{ errors.company_name }}</p>
            </div>

            <div>
              <label for="tax_number" class="block text-sm font-medium text-black">Vergi Numarası / T.C. Kimlik No</label>
              <input
                id="tax_number"
                v-model="form.tax_number"
                type="text"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
              <p v-if="errors.tax_number" class="mt-1 text-xs text-red-600">{{ errors.tax_number }}</p>
            </div>

            <!-- Company Contact Person Name (mapped to user name) -->
            <div>
              <label for="contact_name" class="block text-sm font-medium text-black">Yetkili Ad Soyad</label>
              <input
                id="contact_name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                required
                class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-600">{{ errors.name }}</p>
            </div>
          </template>

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
            <label for="phone" class="block text-sm font-medium text-black">Telefon</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              required
              placeholder="0555 555 55 55"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            />
            <p v-if="errors.phone" class="mt-1 text-xs text-red-600">{{ errors.phone }}</p>
          </div>

          <div v-if="form.is_company">
            <label for="address" class="block text-sm font-medium text-black">Fatura Adresi</label>
            <textarea
              id="address"
              v-model="form.address"
              rows="3"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white resize-none"
            ></textarea>
            <p v-if="errors.address" class="mt-1 text-xs text-red-600">{{ errors.address }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-black">Şifre</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-red-600">{{ errors.password }}</p>
          </div>
          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-black">Şifre (tekrar)</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
              required
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black bg-white"
            />
            <p v-if="errors.password_confirmation" class="mt-1 text-xs text-red-600">{{ errors.password_confirmation }}</p>
          </div>
          <div class="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              :disabled="processing"
              class="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-70 transition-colors"
            >
              {{ processing ? 'Kaydediliyor…' : (form.is_company ? 'Kurumsal Kayıt Ol' : 'Kayıt Ol') }}
            </button>
            <a href="/login" class="text-center text-sm text-black hover:underline">
              Zaten hesabım var
            </a>
            <a href="/" class="text-center text-sm text-gray-500 hover:text-black hover:underline">
              Ana sayfaya dön
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
