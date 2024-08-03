import { ProfileTemplate } from '@/components'
import { useUserPageContext } from './layout'
import { useParams } from '@tanstack/react-router'

interface Props {
  index: 0 | 1 | 2
}

export function UserPage({ index }: Props) {
  const { userId } = useParams({
    strict: false,
  })

  const {
    lazyMatchLoader,
    lazyStandingsLoader,
    userLoader: [user, loadingUser],
  } = useUserPageContext()

  if (!user || loadingUser) {
    return <>loading</>
  }

  return (
    <ProfileTemplate
      baseUrl={`/user/${userId}`}
      index={index}
      user={user}
      lazyStandingsLoader={lazyStandingsLoader}
      lazyMatchLoader={lazyMatchLoader}
    />
  )
}
