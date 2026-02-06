<!-- resources/js/components/profile/ProfileCompletion.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-vue-next';

interface Hint {
  id: string;
  label: string;
}

const props = defineProps<{
  percentage: number;
  hints: Hint[];
}>();

const emit = defineEmits<{
  'action': [type: string];
}>();

const progressColor = computed(() => {
  if (props.percentage < 40) return 'bg-red-500';
  if (props.percentage < 80) return 'bg-yellow-500';
  return 'bg-green-500';
});
</script>

<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Profil Tamamlanma Oranı</h3>
        <p class="text-xs text-gray-500 mt-1">Hesabınızı tam kapasite kullanmak için eksikleri tamamlayın</p>
      </div>
      <span class="text-2xl font-black text-gray-900">{{ percentage }}%</span>
    </div>

    <!-- Progress Bar -->
    <div class="mb-8 h-3 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        class="h-full transition-all duration-1000 ease-out"
        :class="progressColor"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <!-- Hints -->
    <div v-if="hints.length > 0" class="space-y-3">
      <div 
        v-for="hint in hints" 
        :key="hint.id"
        class="group flex items-center justify-between rounded-xl bg-gray-50 p-3.5 transition-all hover:bg-gray-100"
      >
        <div class="flex items-center gap-3">
          <Circle :size="18" class="text-gray-300" />
          <span class="text-sm font-semibold text-gray-700">{{ hint.label }}</span>
        </div>
        <button 
          @click="emit('action', hint.id)"
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-400 opacity-0 shadow-sm transition-all group-hover:opacity-100 hover:text-black"
        >
          <ArrowRight :size="16" />
        </button>
      </div>
    </div>

    <!-- Completed Message -->
    <div v-else class="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-700">
      <CheckCircle2 :size="20" />
      <p class="text-sm font-bold">Harika! Profiliniz tamamen hazır.</p>
    </div>
  </div>
</template>
