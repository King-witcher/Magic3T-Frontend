import { models } from '@/models'
import { useQuery } from '@tanstack/react-query'

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      return await models.matches.getById(id)
    },
    staleTime: Number.POSITIVE_INFINITY,
  })
}
