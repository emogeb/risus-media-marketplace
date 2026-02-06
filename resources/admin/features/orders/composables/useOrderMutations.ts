import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updateOrderStatus } from '../api/orders.api'
import type { Order, OrderStatus } from '../types'

export function useOrderMutations() {
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
    },
  })

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: OrderStatus }) => {
      const results = await Promise.all(ids.map((id) => updateOrderStatus(id, status)))
      return results
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
    },
  })

  return {
    updateStatus: updateStatusMutation,
    bulkUpdateStatus: bulkUpdateStatusMutation,
  }
}
