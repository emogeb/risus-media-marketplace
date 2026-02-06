import { useQuery } from '@tanstack/vue-query'
import { getCategories } from '../api/categories.api'

export function useCategoriesQuery() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await getCategories()
            return response.data || []
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}
