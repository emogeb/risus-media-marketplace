import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { getStoreProfile, updateStoreProfile } from '../api/storeProfile.api'
import { toastService } from '@admin/composables/useToast'
import type { StoreProfile, StoreProfileUpdateInput } from '../types'

export function useStoreProfileQuery() {
  return useQuery<{ data: StoreProfile }>({
    queryKey: ['storeProfile'],
    queryFn: () => getStoreProfile(),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0,
    staleTime: 60_000,
  })
}

export function useUpdateStoreProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: StoreProfileUpdateInput) => updateStoreProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeProfile'] })
      toastService.showSuccess('Başarılı', 'Mağaza bilgileri başarıyla güncellendi')
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Mağaza bilgileri güncellenirken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}
