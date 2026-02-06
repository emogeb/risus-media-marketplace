import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createStore, updateStore, deleteStore } from '../api/stores.api'
import type { StoreCreateInput, StoreUpdateInput } from '../types'
import { useRouter } from 'vue-router'
import { toastService } from '@admin/composables/useToast'

export function useCreateStore() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: StoreCreateInput) => createStore(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      queryClient.refetchQueries({ queryKey: ['stores'], type: 'active' })
      toastService.showSuccess('Başarılı', 'Mağaza başarıyla oluşturuldu')
      router.push({ name: 'stores' })
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Mağaza oluşturulurken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: StoreUpdateInput }) =>
      updateStore(String(id), input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      toastService.showSuccess('Başarılı', 'Mağaza başarıyla güncellendi')
      router.push({ name: 'stores' })
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Mağaza güncellenirken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}

export function useDeleteStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string | number) => deleteStore(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      toastService.showSuccess('Başarılı', 'Mağaza başarıyla silindi')
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Mağaza silinirken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}
