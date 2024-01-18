import { useEffect } from 'react'
import { useUserPageContext } from '../../layout'
import MatchViewer from '@/components/MatchViewer'
import { useParams } from 'react-router-dom'

export default function UserMatchPage() {
  const {
    userLoader: [user],
  } = useUserPageContext()

  const { matchId } = useParams()

  const {
    lazyMatchLoader: [matches, loading, load],
  } = useUserPageContext()

  useEffect(() => {
    if (!matches && !loading) load()
  }, [matches, load])

  if (!user) return <></>

  if (loading || !matches) return 'loading'

  for (const match of matches) {
    if (match._id === matchId) {
      return <MatchViewer match={match} referenceUid={user._id} />
    }
  }

  return <>Match not found</>
}
