import { models } from '@/models'
import { queryOptions } from '@tanstack/react-query'

export function matchQueryOptions(id: string) {
  return queryOptions({
    queryKey: ['match', id],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.matches.getById(id)
    },
  })
}

// export function userQueryOptions(uid: string) {
//   return queryOptions({
//     queryKey: ['user', uid],
//     // staleTime: Number.POSITIVE_INFINITY,
//     queryFn: async () => {
//       return await models.users.getById(uid)
//     },
//   })
// }

export function matchesQueryOptions(uid: string) {
  return queryOptions({
    queryKey: ['matches', uid],
    // staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.matches.listByPlayerId(uid)
    },
  })
}

export function rankingQueryOptions() {
  return queryOptions({
    queryKey: ['ranking'],
    // staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.users.getRanking()
    },
  })
}
