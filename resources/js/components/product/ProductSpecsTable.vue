<script setup lang="ts">
import type { ProductSpec } from '@/types/product';

interface Props {
  specs: ProductSpec[];
}

defineProps<Props>();
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-black/10 bg-white">
    <table class="w-full">
      <tbody class="divide-y divide-black/5">
        <tr v-for="(spec, index) in specs" :key="index" class="group hover:bg-black/[0.02]">
          <td class="px-4 py-3 text-sm text-gray-600 font-medium">
            {{ spec.label }}
          </td>
          <td class="px-7 py-5 text-sm text-gray-900 text-right">
            {{ spec.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
