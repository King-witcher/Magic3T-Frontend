import { MatchTemplate } from '@/components/templates/match'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useUserPageContext } from '../../layout'

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

  if (!user) return null

  if (loading || !matches) return 'loading'

  for (const match of matches) {
    if (match._id === matchId) {
      return <MatchTemplate match={match} viewAs={user._id} />
    }
  }

  return <>Match not found</>
}
