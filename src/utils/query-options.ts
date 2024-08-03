import { models } from '@/models'
import { queryOptions } from '@tanstack/react-query'

export function matchOptions(id: string) {
  return queryOptions({
    queryKey: ['match', id],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.matches.getById(id)
    },
  })
}

export function userOptions(uid: string) {
  return queryOptions({
    queryKey: ['user', uid],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.users.getById(uid)
    },
  })
}

export function matchesOptions(uid: string) {
  return queryOptions({
    queryKey: ['matches', uid],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.matches.listByPlayerId(uid)
    },
  })
}

export function standingsOptions() {
  return queryOptions({
    queryKey: ['standings'],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: async () => {
      return await models.users.getStandings()
    },
  })
}
