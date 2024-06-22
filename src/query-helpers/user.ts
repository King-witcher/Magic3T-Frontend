import { models } from '@/models'
import { queryOptions } from '@tanstack/react-query'

export function getUserQueryOptions(uid: string) {
  return queryOptions({
    queryKey: ['user', uid],
    queryFn: async () => {
      return await models.users.getById(uid)
    },
    staleTime: 1000 * 60 * 5,
  })
}
