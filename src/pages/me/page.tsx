import ProfileView from '@/components/ProfileView'
import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { useMeContext } from './layout'

export default function MePage() {
  const { user, loading } = useAuth()
  const { lazyMatchLoader } = useMeContext()

  if (!user) {
    return <SignInPage />
  }

  return <ProfileView user={user} lazyMatchLoader={lazyMatchLoader} />
}
