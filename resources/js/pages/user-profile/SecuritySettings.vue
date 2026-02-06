<!-- resources/js/components/profile/SecuritySettings.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm, router, usePage } from '@inertiajs/vue3';
import { Lock, Shield, Key, AlertCircle, CheckCircle, Loader2 } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import Button from '@/components/ui/Button.vue';
import type { PasswordUpdateData } from '@/types/profile';

const props = defineProps<{
  user?: any;
}>();

const page = usePage();
const currentUser = computed(() => props.user ?? (page.props.auth as any)?.user ?? null);
const isSuspended = computed(() => !!currentUser.value?.is_suspended);

const form = useForm<PasswordUpdateData>({
  current_password: '',
  password: '',
  password_confirmation: '',
});

const { addToast } = useToast();
const showPasswords = ref(false);
const suspending = ref(false);

const ziggyReady = computed(() => typeof (window as any).route === 'function' && !!(window as any).Ziggy?.routes);
const hasTwoFactorRoute = computed(() => ziggyReady.value && (window as any).route().has?.('two-factor.show'));

const submit = () => {
  if (!ziggyReady.value) return;

  form.put(route('user-password.update'), {
    preserveScroll: true,
    onSuccess: () => {
      addToast('Şifreniz başarıyla güncellendi!');
      form.reset();
    },
    onError: () => {
      addToast('Şifre güncellenirken bir hata oluştu.', 'error');
    }
  });
};

const handleSuspend = () => {
  if (!ziggyReady.value) return;
  if (confirm('Hesabınızı dondurmak istediğinizden emin misiniz? Dondurursanız hesabınız pasif hale gelir ve tekrar giriş yapana kadar gizli kalır.')) {
    suspending.value = true;
    router.post(route('profile.suspend'), {}, {
      onSuccess: () => addToast('Hesabınız donduruldu.', 'info'),
      onFinish: () => suspending.value = false,
    });
  }
};

const handleReactivate = () => {
  if (!ziggyReady.value) return;
  suspending.value = true;
  router.post(route('profile.reactivate'), {}, {
    onSuccess: () => addToast('Hesabınız tekrar aktifleştirildi.', 'success'),
    onFinish: () => suspending.value = false,
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Password Change Section -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Key :size="24" class="text-gray-600" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Şifre Değiştir</h2>
          <p class="text-sm text-gray-600">Hesabınızın güvenliği için güçlü bir şifre kullanın</p>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-5">
        <!-- Current Password -->
        <div>
          <label for="current_password" class="mb-2 block text-sm font-medium text-gray-900">
            Mevcut Şifre
          </label>
          <input
            id="current_password"
            v-model="form.current_password"
            :type="showPasswords ? 'text' : 'password'"
            required
            autocomplete="current-password"
            class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:ring-black"
            :class="{ 'border-red-500': form.errors.current_password }"
          />
          <p v-if="form.errors.current_password" class="mt-2 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle :size="16" />
            {{ form.errors.current_password }}
          </p>
        </div>

        <!-- New Password -->
        <div>
          <label for="password" class="mb-2 block text-sm font-medium text-gray-900">
            Yeni Şifre
          </label>
          <input
            id="password"
            v-model="form.password"
            :type="showPasswords ? 'text' : 'password'"
            required
            autocomplete="new-password"
            class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:ring-black"
            :class="{ 'border-red-500': form.errors.password }"
          />
          <p v-if="form.errors.password" class="mt-2 flex items-center gap-1 text-sm text-red-600">
            <AlertCircle :size="16" />
            {{ form.errors.password }}
          </p>
          <p v-else class="mt-2 text-sm text-gray-600">
            En az 8 karakter, büyük/küçük harf, rakam ve özel karakter içermelidir
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="password_confirmation" class="mb-2 block text-sm font-medium text-gray-900">
            Yeni Şifre (Tekrar)
          </label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            :type="showPasswords ? 'text' : 'password'"
            required
            autocomplete="new-password"
            class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm focus:border-black focus:ring-black"
          />
        </div>

        <!-- Show Passwords Toggle -->
        <div>
          <label class="flex cursor-pointer items-center gap-3">
            <input
              v-model="showPasswords"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <span class="text-sm text-gray-700">Şifreleri göster</span>
          </label>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          variant="primary"
          :disabled="form.processing"
          class="inline-flex items-center gap-2"
        >
          <Lock :size="18" />
          {{ form.processing ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}
        </Button>
      </form>
    </div>

    <!-- Two-Factor Authentication Section -->
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Shield :size="24" class="text-blue-600" />
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">İki Faktörlü Doğrulama</h2>
          <p class="text-sm text-gray-600">Hesabınıza ekstra güvenlik katmanı ekleyin</p>
        </div>
      </div>

      <p class="mb-4 text-sm text-gray-600">
        İki faktörlü doğrulama, hesabınıza giriş yaparken şifrenize ek olarak telefonunuzdan bir kod girmenizi gerektirir.
      </p>

      <a
        v-if="hasTwoFactorRoute"
        :href="route('two-factor.show')"
        class="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50"
      >
        <Shield :size="18" />
        2FA Ayarlarını Yönet
      </a>
      <div v-else class="text-sm text-gray-500 italic">
        İki faktörlü doğrulama ayarları şu an kullanılamıyor.
      </div>
    </div>

    <!-- Account Security Tips -->
    <div class="rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <h3 class="mb-3 font-semibold text-blue-900">Güvenlik İpuçları</h3>
      <ul class="space-y-2 text-sm text-blue-800">
        <li class="flex items-start gap-2">
          <span class="mt-0.5">•</span>
          <span>Şifrenizi düzenli olarak değiştirin</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="mt-0.5">•</span>
          <span>Farklı platformlarda aynı şifreyi kullanmayın</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="mt-0.5">•</span>
          <span>İki faktörlü doğrulamayı aktif edin</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="mt-0.5">•</span>
          <span>Şüpheli aktivite gördüğünüzde hemen şifrenizi değiştirin</span>
        </li>
      </ul>
    </div>

      <div v-if="currentUser" class="rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <div class="mb-4 flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield :size="24" class="text-red-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Hesabı Dondur</h2>
            <p class="text-sm text-gray-600">Hesabınızı geçici olarak pasif hale getirin</p>
          </div>
        </div>

        <p class="mb-6 text-sm text-gray-600">
          Hesabınızı dondurduğunuzda profiliniz gizlenir ve aktivite duraklatılır. Dilediğiniz zaman tekrar giriş yaparak hesabınızı aktifleştirebilirsiniz.
        </p>

        <Button
          v-if="!isSuspended"
          variant="outline"
          @click="handleSuspend"
          :disabled="suspending"
          class="border-red-200 text-red-600 hover:bg-red-50"
        >
          <Loader2 v-if="suspending" :size="16" class="mr-2 animate-spin" />
          Hesabımı Dondur
        </Button>
        <Button
          v-else
          variant="primary"
          @click="handleReactivate"
          :disabled="suspending"
        >
          <Loader2 v-if="suspending" :size="16" class="mr-2 animate-spin" />
          Hesabı Aktifleştir
        </Button>
      </div>
  </div>
</template>
