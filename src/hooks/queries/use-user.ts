import { models } from '@/models'
import type { UserData } from '@/models/users/User'
import {
  type UndefinedInitialDataOptions,
  useQuery,
} from '@tanstack/react-query'

export function useUser(
  uid: string,
  options: Omit<
    UndefinedInitialDataOptions<UserData, Error, UserData, string[]>,
    'queryKey'
  >
) {
  return useQuery({
    queryKey: ['user', uid],
    staleTime: 1000 * 60 * 5,
    enabled: !!uid,
    queryFn: async () => {
      return await models.users.getById(uid || '')
    },
    ...options,
  })
}
