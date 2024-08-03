import { ProfileTemplate } from '@/components'
import { useGuardedAuth } from '@/contexts/guarded-auth.context.tsx'
import { useMeContext } from './layout'

interface Props {
  index: 0 | 1 | 2
}

export default function MePage({ index }: Props) {
  const { user } = useGuardedAuth()
  const { lazyMatchLoader, lazyStandingsLoader } = useMeContext()

  return (
    <ProfileTemplate
      baseUrl="/me"
      index={index}
      user={user}
      lazyStandingsLoader={lazyStandingsLoader}
      lazyMatchLoader={lazyMatchLoader}
    />
  )
}
