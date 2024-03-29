import ProfileView from '@/components/ProfileView'
import { useMeContext } from './layout'
import { useGuardedAuth } from '@/contexts/GuardedAuthContext'

interface Props {
  index: 0 | 1 | 2
}

export default function MePage({ index }: Props) {
  const { user } = useGuardedAuth()
  const { lazyMatchLoader, lazyStandingsLoader } = useMeContext()

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
