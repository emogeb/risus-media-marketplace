<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Props {
  min: string;
  max: string;
  currencyLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currencyLabel: '₺',
});

const emit = defineEmits<{
  'update:min': [value: string];
  'update:max': [value: string];
}>();

const localMin = ref(props.min || '');
const localMax = ref(props.max || '');

watch(
  () => props.min,
  v => (localMin.value = v || '')
);
watch(
  () => props.max,
  v => (localMax.value = v || '')
);

watch(localMin, v => emit('update:min', v));
watch(localMax, v => emit('update:max', v));

const hint = computed(() => {
  if (!localMin.value && !localMax.value) return 'Aralık seçilmedi';
  return `${localMin.value || '0'} ${props.currencyLabel} - ${localMax.value || '∞'} ${props.currencyLabel}`;
});
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-xs text-gray-600">Min</label>
        <div class="relative">
          <input
            v-model="localMin"
            inputmode="numeric"
            type="number"
            placeholder="0"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <span class="pointer-events-none absolute right-3 top-2 text-sm text-gray-500">{{ currencyLabel }}</span>
        </div>
      </div>
      <div>
        <label class="mb-1 block text-xs text-gray-600">Max</label>
        <div class="relative">
          <input
            v-model="localMax"
            inputmode="numeric"
            type="number"
            placeholder="10000"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
          <span class="pointer-events-none absolute right-3 top-2 text-sm text-gray-500">{{ currencyLabel }}</span>
        </div>
      </div>
    </div>

    <p class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

