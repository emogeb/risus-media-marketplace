<!-- resources/js/components/profile/AddressForm.vue -->
<script setup lang="ts">
import { watch } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { X, MapPin, Save, AlertCircle, Loader2 } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import type { Address, AddressFormData } from '@/types/profile';

const props = defineProps<{
  show: boolean;
  address?: Address;
}>();

const emit = defineEmits<{
  close: [];
  success: [];
}>();

const form = useForm<AddressFormData>({
  title: '',
  full_name: '',
  phone: '',
  city: '',
  district: '',
  neighborhood: '',
  address_line: '',
  postal_code: '',
  is_default: false,
});

watch(
  () => props.address,
  (newAddress) => {
    if (newAddress) {
      form.title = newAddress.title || '';
      form.full_name = newAddress.full_name;
      form.phone = newAddress.phone || '';
      form.city = newAddress.city || '';
      form.district = newAddress.district || '';
      form.neighborhood = newAddress.neighborhood || '';
      form.address_line = newAddress.address_line;
      form.postal_code = newAddress.postal_code || '';
      form.is_default = newAddress.is_default;
    } else {
      form.reset();
    }
  },
  { immediate: true }
);

const submit = () => {
  if (props.address) {
    form.put(route('addresses.update', props.address.id), {
      preserveScroll: true,
      onSuccess: () => {
        emit('success');
        emit('close');
      },
    });
  } else {
    form.post(route('addresses.store'), {
      preserveScroll: true,
      onSuccess: () => {
        emit('success');
        emit('close');
      },
    });
  }
};

const handleClose = () => {
  if (!form.processing) {
    form.reset();
    form.clearErrors();
    emit('close');
  }
};
</script>

<template>
  <!-- Modal Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="handleClose"
    >
      <!-- Modal Content -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="show"
          class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
          <!-- Header -->
          <div class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 p-6 backdrop-blur-md">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white">
                <MapPin :size="20" />
              </div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ address ? 'Adresi Düzenle' : 'Yeni Adres Ekle' }}
              </h2>
            </div>
            <button
              @click="handleClose"
              :disabled="form.processing"
              class="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <X :size="24" />
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="submit" class="p-6">
            <div class="grid gap-6 md:grid-cols-2">
              <!-- Address Title -->
              <div class="md:col-span-2">
                <label for="title" class="mb-2 block text-sm font-semibold text-gray-900">
                  Adres Başlığı (Örn: Ev, İş)
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="Örn: Ev Adresim"
                  :disabled="form.processing"
                />
              </div>

              <!-- Full Name -->
              <div>
                <label for="full_name" class="mb-2 block text-sm font-semibold text-gray-900">
                  Ad Soyad *
                </label>
                <input
                  id="full_name"
                  v-model="form.full_name"
                  type="text"
                  required
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  :class="{ 'border-red-500 bg-red-50/10': form.errors.full_name }"
                  placeholder="Teslim alacak kişi"
                  :disabled="form.processing"
                />
                <p v-if="form.errors.full_name" class="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle :size="14" />
                  {{ form.errors.full_name }}
                </p>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="mb-2 block text-sm font-semibold text-gray-900">
                  Telefon Numarası
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="05XX XXX XX XX"
                  :disabled="form.processing"
                />
              </div>

              <!-- City -->
              <div>
                <label for="city" class="mb-2 block text-sm font-semibold text-gray-900">
                  Şehir
                </label>
                <input
                  id="city"
                  v-model="form.city"
                  type="text"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="Örn: İstanbul"
                  :disabled="form.processing"
                />
              </div>

              <!-- District -->
              <div>
                <label for="district" class="mb-2 block text-sm font-semibold text-gray-900">
                  İlçe
                </label>
                <input
                  id="district"
                  v-model="form.district"
                  type="text"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="Örn: Beşiktaş"
                  :disabled="form.processing"
                />
              </div>

              <!-- Neighborhood -->
              <div>
                <label for="neighborhood" class="mb-2 block text-sm font-semibold text-gray-900">
                  Mahalle
                </label>
                <input
                  id="neighborhood"
                  v-model="form.neighborhood"
                  type="text"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="Örn: Bebek Mah."
                  :disabled="form.processing"
                />
              </div>

              <!-- Postal Code -->
              <div>
                <label for="postal_code" class="mb-2 block text-sm font-semibold text-gray-900">
                  Posta Kodu
                </label>
                <input
                  id="postal_code"
                  v-model="form.postal_code"
                  type="text"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="34XXX"
                  :disabled="form.processing"
                />
              </div>

              <!-- Address Line -->
              <div class="md:col-span-2">
                <label for="address_line" class="mb-2 block text-sm font-semibold text-gray-900">
                  Adres Detayı *
                </label>
                <textarea
                  id="address_line"
                  v-model="form.address_line"
                  required
                  rows="3"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm transition-all focus:border-black focus:bg-white focus:ring-black"
                  placeholder="Sokak, bina no, daire no..."
                  :disabled="form.processing"
                ></textarea>
                <p v-if="form.errors.address_line" class="mt-2 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle :size="14" />
                  {{ form.errors.address_line }}
                </p>
              </div>

              <!-- Default Checkbox -->
              <div class="md:col-span-2">
                <label class="group flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 transition-all hover:bg-gray-100">
                  <input
                    type="checkbox"
                    v-model="form.is_default"
                    class="h-6 w-6 rounded-lg border-gray-300 text-black focus:ring-black"
                    :disabled="form.processing"
                  />
                  <span class="text-sm font-bold text-gray-900">Varsayılan teslimat adresi olarak ayarla</span>
                </label>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                @click="handleClose"
                :disabled="form.processing"
                class="sm:order-1"
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="primary"
                class="inline-flex items-center justify-center gap-2 sm:order-2 sm:min-w-[140px]"
                :disabled="form.processing"
              >
                <Loader2 v-if="form.processing" :size="18" class="animate-spin" />
                <Save v-else :size="18" />
                {{ form.processing ? 'Kaydediliyor...' : (address ? 'Güncelle' : 'Kaydet') }}
              </Button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
