import { type Loader, useAsync } from '@/hooks/useAsync'
import { type LazyLoadData, useLazy } from '@/hooks/useLazy'
import { models } from '@/models'
import type { MatchModel } from '@/models/matches/Match'
import type { UserData } from '@/models/users/User'
import { useQuery } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { Outlet, useParams } from 'react-router-dom'

interface UserPageContextData {
  lazyMatchLoader: LazyLoadData<MatchModel[]>
  lazyStandingsLoader: LazyLoadData<UserData[]>
  userLoader: Loader<UserData>
}

const UserPageContext = createContext<UserPageContextData>(
  {} as UserPageContextData
)

export function UserPageLayout() {
  const { uid } = useParams() as { uid: string }

  const userQuery = useQuery({
    queryKey: ['user', uid],
    staleTime: 2 * 1000 * 60,
    queryFn: async () => {
      return await models.users.getById(uid)
    },
  })

  useQuery({
    queryKey: ['matches', uid],
    enabled: false,
    staleTime: 2 * 1000 * 60,
    queryFn: async () => {
      return await models.matches.listByPlayerId(uid)
    },
  })

  useQuery({
    queryKey: ['standings'],
    enabled: false,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      return await models.users.getStandings()
    },
  })

  if (!userQuery.data) {
    return null
  }

  return (
    <UserPageContext.Provider
      value={{
        lazyMatchLoader,
        lazyStandingsLoader,
        userLoader: [user, loadingUser],
      }}
    >
      <Outlet />
    </UserPageContext.Provider>
  )
}

export const useUserPageContext = () => useContext(UserPageContext)
