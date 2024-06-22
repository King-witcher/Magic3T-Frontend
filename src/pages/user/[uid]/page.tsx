import { ProfileView } from '@/components'
import { useUserPageContext } from './layout'
import { useParams } from 'react-router-dom'

interface Props {
  index: 0 | 1 | 2
}

export default function UserPage({ index }: Props) {
  const { uid } = useParams() as { uid: string }

  const {
    lazyMatchLoader,
    lazyStandingsLoader,
    userLoader: [user, loadingUser],
  } = useUserPageContext()

  if (!user || loadingUser) {
    return <>loading</>
  }

  return (
    <ProfileView
      baseUrl={`/user/${uid}`}
      index={index}
      user={user}
      lazyStandingsLoader={lazyStandingsLoader}
      lazyMatchLoader={lazyMatchLoader}
    />
  )
}
