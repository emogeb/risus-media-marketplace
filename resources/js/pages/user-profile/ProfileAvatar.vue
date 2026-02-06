<!-- resources/js/components/profile/ProfileAvatar.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Upload, User as UserIcon } from 'lucide-vue-next';

const props = defineProps<{
  currentAvatar?: string;
  userName: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  upload: [file: File];
}>();

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

const displayAvatar = computed(() => {
  return previewUrl.value || props.currentAvatar;
});

const initials = computed(() => {
  return props.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    processFile(file);
  }
};

const processFile = (file: File) => {
  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  
  // Emit upload event
  emit('upload', file);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Avatar Display -->
    <div
      class="group relative"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div
        :class="[
          'relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg transition-all',
          isDragging && 'scale-105 border-black',
          loading && 'opacity-50'
        ]"
      >
        <!-- Avatar Image -->
        <img
          v-if="displayAvatar"
          :src="displayAvatar"
          :alt="userName"
          class="h-full w-full object-cover"
        />
        
        <!-- Initials Fallback -->
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-3xl font-bold text-white"
        >
          {{ initials }}
        </div>

        <!-- Loading Overlay -->
        <div
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center bg-black/50"
        >
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        </div>

        <!-- Hover Overlay -->
        <div
          class="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 transition-all group-hover:bg-black/50"
          @click="triggerFileInput"
        >
          <Upload class="text-white opacity-0 transition-opacity group-hover:opacity-100" :size="32" />
        </div>
      </div>

      <!-- Upload Badge -->
      <button
        type="button"
        class="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-black text-white shadow-lg transition-transform hover:scale-110"
        @click="triggerFileInput"
        :disabled="loading"
      >
        <Upload :size="18" />
      </button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Upload Instructions -->
    <div class="text-center">
      <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
      <p class="text-xs text-gray-500">
        Click or drag to upload new avatar
      </p>
    </div>
  </div>
</template>
