<template>
  <Transition name="slide-down">
    <div v-if="hasSelection" class="bg-blue-50 border-b border-blue-200 px-6 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="text-sm font-medium text-blue-900">
            {{ $t('bulkActions.selectedCount', { count: selectionCount }) }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <slot name="actions" :selected-ids="selectedIdsArray" :clear="clear" />
          <UiButton variant="ghost" size="sm" @click="clear">
            {{ $t('bulkActions.clear') }}
          </UiButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiButton from './UiButton.vue'

const props = defineProps<{
  selectedIds: string[] | Set<string>
}>()

const emit = defineEmits<{
  clear: []
}>()

const selectedIdsArray = computed(() => {
  if (props.selectedIds instanceof Set) {
    return Array.from(props.selectedIds)
  }
  return props.selectedIds
})

const hasSelection = computed(() => selectedIdsArray.value.length > 0)
const selectionCount = computed(() => selectedIdsArray.value.length)

function clear() {
  emit('clear')
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
