<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <router-link
        to="/banners"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold">{{ isEditing ? 'Edit Banner' : 'Create Banner' }}</h1>
    </div>

    <div class="mx-auto max-w-2xl rounded-lg border bg-white p-6 shadow-sm">
      <form @submit.prevent="save" class="space-y-6">
        <div>
          <label class="mb-1 block text-sm font-medium">Banner Text</label>
          <input
            v-model="form.text"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="e.g. Special offer: 20% off all dresses!"
          />
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="mb-1 block text-sm font-medium">Background Color</label>
            <div class="flex gap-2">
              <input
                v-model="form.background_color"
                type="color"
                class="h-10 w-20 cursor-pointer rounded border p-0"
              />
              <input
                v-model="form.background_color"
                type="text"
                pattern="^#[0-9A-Fa-f]{6}$"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono uppercase focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Text Color</label>
            <div class="flex gap-2">
              <input
                v-model="form.text_color"
                type="color"
                class="h-10 w-20 cursor-pointer rounded border p-0"
              />
              <input
                v-model="form.text_color"
                type="text"
                pattern="^#[0-9A-Fa-f]{6}$"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono uppercase focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="mb-1 block text-sm font-medium">Start Time (Optional)</label>
            <input
              v-model="form.start_time"
              type="datetime-local"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">End Time (Optional)</label>
            <input
              v-model="form.end_time"
              type="datetime-local"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="is_active"
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label for="is_active" class="text-sm font-medium">Active</label>
        </div>

        <!-- Preview -->
        <div class="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <label class="mb-2 block text-xs font-medium uppercase text-gray-500">Preview</label>
          <div
            class="rounded px-4 py-2 text-center"
            :style="{ backgroundColor: form.background_color, color: form.text_color }"
          >
            {{ form.text || 'Banner Text Preview' }}
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$router.back()"
            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="mutation.isPending.value"
            class="flex items-center gap-2 rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            <span v-if="mutation.isPending.value" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ isEditing ? 'Update Banner' : 'Create Banner' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const id = route.params.id as string
const isEditing = computed(() => !!id)

const form = ref({
  text: '',
  background_color: '#000000',
  text_color: '#ffffff',
  is_active: true,
  start_time: '',
  end_time: '',
})

// Fetch existing data if editing
const { data: banner } = useQuery({
  queryKey: ['banner', id],
  queryFn: async () => {
    if (!id) return null
    const res = await fetch(`/api/banners/${id}`)
    if (!res.ok) throw new Error('Failed to fetch banner')
    return res.json()
  },
  enabled: isEditing,
})

// Populate form when data is loaded
onMounted(() => {
  if (isEditing.value && banner.value) {
    // Wait for query to complete - utilizing watch or improved handling in real app
    // For simplicity, we trust Vue Query caching or reactivity, but let's watch it
  }
})

// Reactively update form when banner data arrives
import { watch } from 'vue'
watch(banner, (newVal) => {
  if (newVal) {
    form.value = {
      text: newVal.text,
      background_color: newVal.background_color,
      text_color: newVal.text_color,
      is_active: Boolean(newVal.is_active),
      start_time: newVal.start_time ? newVal.start_time.slice(0, 16) : '', // format for datetime-local
      end_time: newVal.end_time ? newVal.end_time.slice(0, 16) : '',
    }
  }
})

const mutation = useMutation({
  mutationFn: async (data: any) => {
    const url = isEditing.value ? `/api/banners/${id}` : '/api/banners'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    // Clean up empty dates
    const payload = { ...data }
    if (!payload.start_time) payload.start_time = null
    if (!payload.end_time) payload.end_time = null

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to save banner')
    }
    return res.json()
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] })
    router.push('/banners')
  }
})

function save() {
  mutation.mutate(form.value)
}
</script>
