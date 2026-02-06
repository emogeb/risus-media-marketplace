<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';

interface Props {
  status?: string;
}

defineProps<Props>();
</script>

<template>
  <Head title="E-posta doğrula" />
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
    <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900">E-posta doğrula</h1>
      <p v-if="status" class="mt-2 text-sm text-green-600">{{ status }}</p>
      <p class="mt-4 text-sm text-gray-600">
        E-posta adresinize bir doğrulama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.
      </p>
      <div class="mt-6 flex flex-col gap-3">
        <Link
          href="/email/verification-notification"
          method="post"
          as="button"
          class="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Tekrar gönder
        </Link>
        <Link href="/dashboard" class="text-center text-sm text-gray-600 hover:text-gray-900">
          Panele git
        </Link>
      </div>
    </div>
  </div>
</template>
