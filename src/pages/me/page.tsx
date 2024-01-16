import ProfileView from '@/components/ProfileView'
import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { useMeContext } from './layout'

interface Props {
  index: 0 | 1 | 2
}

export default function MePage({ index }: Props) {
  const { user, loading } = useAuth()
  const { lazyMatchLoader, lazyStandingsLoader } = useMeContext()

  if (!user) {
    return <SignInPage />
  }

  return (
    <ProfileView
      baseUrl="/me"
      index={index}
      user={user}
      lazyStandingsLoader={lazyStandingsLoader}
      lazyMatchLoader={lazyMatchLoader}
    />
  )
}
