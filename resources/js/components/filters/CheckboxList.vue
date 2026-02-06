<script setup lang="ts">
interface Option {
  label: string;
  value: string;
  count?: number;
}

interface Props {
  modelValue: string[];
  options: Option[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const toggle = (val: string) => {
  const set = new Set(props.modelValue || []);
  if (set.has(val)) set.delete(val);
  else set.add(val);
  emit('update:modelValue', Array.from(set));
};
</script>

<template>
  <div class="space-y-2">
    <label
      v-for="opt in options"
      :key="opt.value"
      class="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50"
    >
      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          :checked="modelValue?.includes(opt.value)"
          @change="toggle(opt.value)"
        />
        <span class="text-sm text-gray-800">{{ opt.label }}</span>
      </div>
      <span v-if="typeof opt.count === 'number'" class="text-xs text-gray-500">({{ opt.count }})</span>
    </label>
  </div>
</template>

