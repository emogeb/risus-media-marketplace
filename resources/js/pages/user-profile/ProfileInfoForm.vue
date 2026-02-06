<!-- resources/js/components/profile/ProfileInfoForm.vue -->
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import { useDebounceFn } from '@vueuse/core';
import { Save, AlertCircle, CheckCircle, Loader2, Building2 } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import Button from '@/components/ui/Button.vue';
import type { User, ProfileUpdateData } from '@/types/profile';

const props = defineProps<{
  user: User & { customer_profile?: { company_name?: string; tax_number?: string; customer_type?: string } };
}>();

const ziggyReady = computed(() => typeof (window as any).route === 'function' && !!(window as any).Ziggy?.routes);

// Check if user is corporate based on customer_type field
const isCorporate = computed(() => props.user.customer_profile?.customer_type === 'business');

const form = useForm({
  name: props.user.name,
  email: props.user.email,
  company_name: props.user.customer_profile?.company_name || '',
  tax_number: props.user.customer_profile?.tax_number || '',
});

const { addToast } = useToast();
const nameStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle');

const saveName = useDebounceFn(() => {
  if (form.name === props.user.name) {
    nameStatus.value = 'idle';
    return;
  }

  nameStatus.value = 'saving';
  
  if (!ziggyReady.value) return;
  router.patch(route('profile.update'), { name: form.name }, {
    preserveScroll: true,
    onSuccess: () => {
      nameStatus.value = 'saved';
      addToast('İsim güncellendi.');
      setTimeout(() => {
        if (nameStatus.value === 'saved') nameStatus.value = 'idle';
      }, 3000);
    },
    onError: (errors) => {
      nameStatus.value = 'error';
      form.setError('name', errors.name);
      addToast('İsim güncellenirken hata oluştu.', 'error');
    }
  });
}, 500);

watch(() => form.name, (newValue) => {
  if (newValue !== props.user.name) {
    nameStatus.value = 'saving';
    saveName();
  } else {
    nameStatus.value = 'idle';
  }
});

const submit = () => {
  if (!ziggyReady.value) return;
  form.patch(route('profile.update'), {
    preserveScroll: true,
    onSuccess: () => {
      addToast('Profil bilgileriniz güncellendi.');
    },
    onError: () => {
      addToast('Profil güncellenirken hata oluştu.', 'error');
    }
  });
};

const hasChanges = () => {
  return form.name !== props.user.name || 
         form.email !== props.user.email ||
         form.company_name !== (props.user.customer_profile?.company_name || '') ||
         form.tax_number !== (props.user.customer_profile?.tax_number || '');
};
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      <!-- Name Field (Auto-save) -->
      <div>
        <div class="mb-2 flex items-center justify-between">
          <label for="name" class="text-sm font-medium text-gray-900">
            Ad Soyad
          </label>
          
          <!-- Auto-save Status -->
          <div class="flex items-center gap-1.5 text-xs font-medium">
            <template v-if="nameStatus === 'saving'">
              <Loader2 :size="12" class="animate-spin text-blue-600" />
              <span class="text-blue-600">Kaydediliyor...</span>
            </template>
            <template v-else-if="nameStatus === 'saved'">
              <CheckCircle :size="12" class="text-green-600" />
              <span class="text-green-600">Kaydedildi</span>
            </template>
            <template v-else-if="nameStatus === 'error'">
              <AlertCircle :size="12" class="text-red-600" />
              <span class="text-red-600">Hata!</span>
            </template>
          </div>
        </div>
        
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-black focus:ring-black"
          :class="{ 'border-red-500': form.errors.name }"
          placeholder="Adınızı ve soyadınızı girin"
        />
        <p v-if="form.errors.name" class="mt-2 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle :size="16" />
          {{ form.errors.name }}
        </p>
      </div>

      <!-- Email Field -->
      <div>
        <label for="email" class="mb-2 block text-sm font-medium text-gray-900">
          E-posta Adresi
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-black focus:ring-black"
          :class="{ 'border-red-500': form.errors.email }"
        />
        <p v-if="form.errors.email" class="mt-2 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle :size="16" />
          {{ form.errors.email }}
        </p>
        <p v-else-if="form.email !== user.email" class="mt-2 text-sm text-gray-600">
          E-posta adresinizi değiştirirseniz, yeniden doğrulama yapmanız gerekecektir.
        </p>
      </div>

      <!-- Corporate Fields (Only for business accounts) -->
      <div v-if="isCorporate" class="space-y-6 border-t pt-6">
        <h3 class="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Building2 :size="20" />
            Kurumsal Bilgiler
        </h3>

        <!-- Company Name -->
         <div>
            <label for="company_name" class="mb-2 block text-sm font-medium text-gray-900">
              Şirket Unvanı
            </label>
            <input
              id="company_name"
              v-model="form.company_name"
              type="text"
              class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-black focus:ring-black"
              :class="{ 'border-red-500': form.errors.company_name }"
              placeholder="Şirket resmi unvanı"
            />
            <p v-if="form.errors.company_name" class="mt-2 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle :size="16" />
              {{ form.errors.company_name }}
            </p>
          </div>

          <!-- Tax Number -->
          <div>
            <label for="tax_number" class="mb-2 block text-sm font-medium text-gray-900">
              Vergi Numarası / T.C. Kimlik No
            </label>
            <input
              id="tax_number"
              v-model="form.tax_number"
              type="text"
              class="block w-full rounded-xl border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-black focus:ring-black"
              :class="{ 'border-red-500': form.errors.tax_number }"
              placeholder="Vergi numarası"
            />
            <p v-if="form.errors.tax_number" class="mt-2 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle :size="16" />
              {{ form.errors.tax_number }}
            </p>
          </div>
      </div>

      <!-- Submit Button (Manual Save for email or overall) -->
      <div class="flex items-center gap-4">
        <Button
          type="submit"
          variant="primary"
          :disabled="form.processing || !hasChanges()"
          class="inline-flex items-center gap-2"
        >
          <Save :size="18" />
          {{ form.processing ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
        </Button>

        <p v-if="!hasChanges()" class="text-sm text-gray-500">
          Değişiklik yapılmadı
        </p>
      </div>
    </form>
  </div>
</template>
