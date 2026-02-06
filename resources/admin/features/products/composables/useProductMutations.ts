import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { updateProductStock, createProduct, updateProduct, deleteProduct } from '../api/products.api'
import { toastService } from '@admin/composables/useToast'
import type { ProductCreateInput, ProductUpdateInput } from '../api/products.api'

export function useProductMutations() {
  const queryClient = useQueryClient()

  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateProductStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
    },
  })

  return {
    updateStock: updateStockMutation,
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: ProductCreateInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toastService.showSuccess('Başarılı', 'Ürün başarıyla oluşturuldu')
      router.push({ name: 'products' })
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Ürün oluşturulurken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductUpdateInput }) =>
      updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      toastService.showSuccess('Başarılı', 'Ürün başarıyla güncellendi')
      router.push({ name: 'products' })
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Ürün güncellenirken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toastService.showSuccess('Başarılı', 'Ürün başarıyla silindi')
    },
    onError: (error: Error) => {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Ürün silinirken bir hata oluştu'
      toastService.showError('Hata', message)
    },
  })
}
