<!-- resources/js/components/profile/BillingForm.vue -->
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { computed } from 'vue';
import { CreditCard, Building2, User as UserIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';
import Button from '@/components/ui/Button.vue';

interface BillingProfile {
  type: string;
  full_name?: string;
  tc_identity?: string;
  company_name?: string;
  tax_number?: string;
  tax_office?: string;
  is_einvoice: boolean;
  address_id?: number | null;
}

interface Address {
  id: number;
  title: string;
}

const props = defineProps<{
  profile: BillingProfile | null;
  addresses: Address[];
}>();

const ziggyReady = computed(() => typeof (window as any).route === 'function' && !!(window as any).Ziggy?.routes);

const { addToast } = useToast();

const form = useForm({
  type: props.profile?.type ?? 'personal',
  full_name: props.profile?.full_name ?? '',
  tc_identity: props.profile?.tc_identity ?? '',
  company_name: props.profile?.company_name ?? '',
  tax_number: props.profile?.tax_number ?? '',
  tax_office: props.profile?.tax_office ?? '',
  is_einvoice: props.profile?.is_einvoice ?? false,
  address_id: props.profile?.address_id ?? (props.addresses.length > 0 ? props.addresses[0].id : null),
});

const submit = () => {
  if (!ziggyReady.value) return;
  form.put(route('billing.update'), {
    preserveScroll: true,
    onSuccess: () => {
      addToast('Fatura bilgileriniz başarıyla güncellendi.');
    },
    onError: () => {
      addToast('Bilgiler kaydedilirken bir hata oluştu.', 'error');
    }
  });
};
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-8 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CreditCard :size="24" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Fatura Bilgileri</h2>
          <p class="text-sm text-gray-600">Siparişleriniz için fatura detaylarını yönetin</p>
        </div>
      </div>

      <form @submit.prevent="submit" class="space-y-8">
        <!-- Type Selection -->
        <div class="flex gap-4">
          <label 
            class="flex-1 cursor-pointer flex items-center gap-3 rounded-xl border p-4 transition-all"
            :class="form.type === 'personal' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'"
          >
            <input 
              v-model="form.type" 
              type="radio" 
              value="personal" 
              class="hidden"
            />
            <UserIcon :size="20" />
            <span class="font-bold">Bireysel</span>
            <CheckCircle v-if="form.type === 'personal'" :size="16" class="ml-auto" />
          </label>
          
          <label 
            class="flex-1 cursor-pointer flex items-center gap-3 rounded-xl border p-4 transition-all"
            :class="form.type === 'company' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'"
          >
            <input 
              v-model="form.type" 
              type="radio" 
              value="company" 
              class="hidden"
            />
            <Building2 :size="20" />
            <span class="font-bold">Kurumsal</span>
            <CheckCircle v-if="form.type === 'company'" :size="16" class="ml-auto" />
          </label>
        </div>

        <!-- Dynamic Fields -->
        <div class="grid gap-6">
          <template v-if="form.type === 'personal'">
            <div>
              <label class="mb-2 block text-sm font-bold text-gray-900">Ad Soyad</label>
              <input 
                v-model="form.full_name" 
                type="text" 
                placeholder="Örn: Ahmet Yılmaz"
                class="block w-full rounded-xl border-gray-300 px-4 py-3 focus:border-black focus:ring-black"
                :class="{ 'border-red-500': form.errors.full_name }"
              />
              <p v-if="form.errors.full_name" class="mt-2 text-xs text-red-600">{{ form.errors.full_name }}</p>
            </div>
            <div>
              <label class="mb-2 block text-sm font-bold text-gray-900">TC Kimlik No (Opsiyonel)</label>
              <input 
                v-model="form.tc_identity" 
                type="text" 
                maxlength="11"
                placeholder="11 haneli TC no"
                class="block w-full rounded-xl border-gray-300 px-4 py-3 focus:border-black focus:ring-black"
                :class="{ 'border-red-500': form.errors.tc_identity }"
              />
            </div>
          </template>

          <template v-else>
            <div>
              <label class="mb-2 block text-sm font-bold text-gray-900">Firma Adı</label>
              <input 
                v-model="form.company_name" 
                type="text" 
                placeholder="Örn: Risus Medya A.Ş."
                class="block w-full rounded-xl border-gray-300 px-4 py-3 focus:border-black focus:ring-black"
                :class="{ 'border-red-500': form.errors.company_name }"
              />
            </div>
            <div class="grid gap-6 sm:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-900">Vergi Numarası</label>
                <input 
                  v-model="form.tax_number" 
                  type="text" 
                  maxlength="10"
                  placeholder="10 haneli vergi no"
                  class="block w-full rounded-xl border-gray-300 px-4 py-3 focus:border-black focus:ring-black"
                  :class="{ 'border-red-500': form.errors.tax_number }"
                />
              </div>
              <div>
                <label class="mb-2 block text-sm font-bold text-gray-900">Vergi Dairesi</label>
                <input 
                  v-model="form.tax_office" 
                  type="text" 
                  placeholder="Bağlı olduğunuz vergi dairesi"
                  class="block w-full rounded-xl border-gray-300 px-4 py-3 focus:border-black focus:ring-black"
                  :class="{ 'border-red-500': form.errors.tax_office }"
                />
              </div>
            </div>
            <label class="flex cursor-pointer items-center gap-3">
              <input 
                v-model="form.is_einvoice" 
                type="checkbox" 
                class="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <span class="text-sm font-bold text-gray-900">E-Fatura Mükellefiyim</span>
            </label>
          </template>

          <!-- Address Binding -->
          <div>
            <label class="mb-2 block text-sm font-bold text-gray-900">Fatura Adresi</label>
            <div v-if="addresses.length > 0" class="relative">
              <select 
                v-model="form.address_id"
                class="block w-full appearance-none rounded-xl border-gray-300 pl-4 pr-10 py-3 focus:border-black focus:ring-black bg-white"
              >
                <option v-for="addr in addresses" :key="addr.id" :value="addr.id">
                  {{ addr.title }}
                </option>
              </select>
            </div>
            <div v-else class="rounded-xl border border-yellow-100 bg-yellow-50 p-4 flex items-center gap-3">
              <AlertCircle :size="18" class="text-yellow-600" />
              <p class="text-sm text-yellow-700">Kayıtlı adresiniz bulunamadı. Lütfen önce bir adres ekleyin.</p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <Button 
          type="submit" 
          variant="primary" 
          :disabled="form.processing"
          class="inline-flex items-center gap-2"
        >
          <Loader2 v-if="form.processing" :size="18" class="animate-spin" />
          {{ form.processing ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
        </Button>
      </form>
    </div>
  </div>
</template>
