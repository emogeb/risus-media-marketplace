<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Banners</h1>
      <router-link
        to="/banners/create"
        class="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Add Banner
      </router-link>
    </div>

    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>

      <div v-else-if="banners?.length === 0" class="flex flex-col items-center justify-center py-12 text-center text-gray-500">
        <p class="mb-4 text-lg">No banners found</p>
        <router-link
          to="/banners/create"
          class="text-sm font-medium text-black underline underline-offset-4"
        >
          Create your first banner
        </router-link>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b text-gray-500">
              <th class="px-4 py-3 font-medium">Text</th>
              <th class="px-4 py-3 font-medium">Colors</th>
              <th class="px-4 py-3 font-medium">Status</th>
              <th class="px-4 py-3 font-medium">Duration</th>
              <th class="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="banner in banners" :key="banner.id" class="border-b last:border-0 hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ banner.text }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <span
                    class="h-6 w-6 rounded border shadow-sm"
                    :style="{ backgroundColor: banner.background_color }"
                    title="Background"
                  ></span>
                  <span
                    class="h-6 w-6 rounded border shadow-sm"
                    :style="{ backgroundColor: banner.text_color }"
                    title="Text"
                  ></span>
                </div>
              </td>
              <td class="px-4 py-3">
                <button
                  @click="toggleStatus(banner)"
                  class="rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                  :class="banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
                >
                  {{ banner.is_active ? 'Active' : 'Inactive' }}
                </button>
              </td>
              <td class="px-4 py-3 text-gray-500">
                <div v-if="banner.start_time || banner.end_time" class="flex flex-col text-xs">
                  <span v-if="banner.start_time">From: {{ formatDate(banner.start_time) }}</span>
                  <span v-if="banner.end_time">To: {{ formatDate(banner.end_time) }}</span>
                </div>
                <span v-else>Always</span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex justify-end gap-2">
                  <router-link
                    :to="`/banners/${banner.id}/edit`"
                    class="p-1 text-gray-500 hover:text-black"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteBanner(banner.id)"
                    class="p-1 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { format } from 'date-fns'

interface Banner {
  id: number
  text: string
  background_color: string
  text_color: string
  is_active: boolean
  start_time: string | null
  end_time: string | null
}

const queryClient = useQueryClient()

const { data: banners, isLoading } = useQuery({
  queryKey: ['banners'],
  queryFn: async () => {
    const res = await fetch('/api/banners')
    if (!res.ok) throw new Error('Failed to fetch banners')
    return res.json() as Promise<Banner[]>
  }
})

const toggleMutation = useMutation({
  mutationFn: async (banner: Banner) => {
    const res = await fetch(`/api/banners/${banner.id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error('Failed to toggle banner')
    return res.json()
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] })
  }
})

const deleteMutation = useMutation({
  mutationFn: async (id: number) => {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete banner')
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['banners'] })
  }
})

function toggleStatus(banner: Banner) {
  toggleMutation.mutate(banner)
}

function deleteBanner(id: number) {
  if (confirm('Are you sure you want to delete this banner?')) {
    deleteMutation.mutate(id)
  }
}

function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy HH:mm')
}
</script>
