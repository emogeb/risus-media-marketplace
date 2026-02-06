<!-- resources/js/components/profile/ProfileTabs.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { User, Package, MapPin, Lock, Heart, CreditCard, History } from 'lucide-vue-next';

const props = withDefaults(defineProps<{
  modelValue?: string;
}>(), {
  modelValue: 'profile'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const activeTab = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  activeTab.value = newValue;
});

const tabs = [
  { id: 'profile', label: 'Profil Bilgileri', icon: User },
  { id: 'orders', label: 'Siparişlerim', icon: Package },
  { id: 'recently_viewed', label: 'Son Görüntülenenler', icon: History },
  { id: 'activity', label: 'Hesap Geçmişi', icon: History },
  { id: 'favorites', label: 'Favorilerim', icon: Heart },
  { id: 'addresses', label: 'Adreslerim', icon: MapPin },
  { id: 'billing', label: 'Fatura Bilgileri', icon: CreditCard },
  { id: 'security', label: 'Güvenlik', icon: Lock },
];

const selectTab = (tabId: string) => {
  activeTab.value = tabId;
  emit('update:modelValue', tabId);
};
</script>

<template>
  <div class="w-full">
    <!-- Desktop Tabs -->
    <div class="hidden border-b border-gray-200 md:block">
      <nav class="-mb-px flex gap-6" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="selectTab(tab.id)"
          :class="[
            'group inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-all',
            activeTab === tab.id
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          ]"
        >
          <component
            :is="tab.icon"
            :size="18"
            :class="[
              'transition-colors',
              activeTab === tab.id ? 'text-black' : 'text-gray-400 group-hover:text-gray-500'
            ]"
          />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Mobile Tabs (Dropdown Style) -->
    <div class="md:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <select
        id="tabs"
        :value="activeTab"
        @change="selectTab(($event.target as HTMLSelectElement).value)"
        class="block w-full rounded-xl border-gray-300 py-3 pl-3 pr-10 text-base focus:border-black focus:outline-none focus:ring-black"
      >
        <option
          v-for="tab in tabs"
          :key="tab.id"
          :value="tab.id"
        >
          {{ tab.label }}
        </option>
      </select>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <div v-show="activeTab === 'profile'">
        <slot name="profile" />
      </div>
      <div v-show="activeTab === 'orders'">
        <slot name="orders" />
      </div>
      <div v-show="activeTab === 'favorites'">
        <slot name="favorites" />
      </div>
      <div v-show="activeTab === 'recently_viewed'">
        <slot name="recently_viewed" />
      </div>
      <div v-show="activeTab === 'activity'">
        <slot name="activity" />
      </div>
      <div v-show="activeTab === 'addresses'">
        <slot name="addresses" />
      </div>
      <div v-show="activeTab === 'billing'">
        <slot name="billing" />
      </div>
      <div v-show="activeTab === 'security'">
        <slot name="security" />
      </div>
    </div>
  </div>
</template>
