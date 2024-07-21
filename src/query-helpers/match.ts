import { models } from '@/models'
import { queryOptions } from '@tanstack/react-query'

export function getMatchQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['match', id],
    queryFn: async () => {
      return await models.matches.getById(id)
    },
    staleTime: Number.POSITIVE_INFINITY,
  })
}
