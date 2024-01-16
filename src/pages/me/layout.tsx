import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { LazyLoadData, useLazy } from '@/hooks/useLazy'
import { models } from '@/models'
import { Match } from '@/models/matches/Match'
import { UserData } from '@/models/users/User'
import { createContext, useContext } from 'react'
import { Outlet } from 'react-router-dom'

interface MeContextData {
  lazyMatchLoader: LazyLoadData<Match[]>
  lazyStandingsLoader: LazyLoadData<UserData[]>
}

const MeContext = createContext<MeContextData>({} as MeContextData)

export default function MeLayout() {
  const { user } = useAuth()

  const lazyMatchLoader = useLazy(async () => {
    if (user) {
      const matches = await models.matches.listByPlayerId(user._id)
      return matches
    }
    return []
  }, [user?._id])

  const lazyStandingsLoader = useLazy(async () => {
    return await models.users.getStandings()
  }, [])

  if (!user) {
    return <SignInPage />
  }

  return (
    <MeContext.Provider value={{ lazyMatchLoader, lazyStandingsLoader }}>
      <Outlet />
    </MeContext.Provider>
  )
}

export const useMeContext = () => useContext(MeContext)
