import { useEffect } from 'react'
import { useMeContext } from '../../layout'
import MatchViewer from '@/components/MatchViewer'
import { useAuth } from '@/contexts/AuthContext'
import SignInPage from '@/components/SignInPage'
import { useParams } from 'react-router-dom'

export default function MeMatchPage() {
  const { user } = useAuth()

  const { matchId } = useParams()

  const {
    lazyMatchLoader: [matches, loading, load],
  } = useMeContext()

  useEffect(() => {
    if (!matches && !loading) load()
  }, [matches, load])

  if (!user) return <SignInPage />

  if (loading || !matches) return 'loading'

  for (const match of matches) {
    if (match._id === matchId) {
      return <MatchViewer match={match} referenceUid={user._id} />
    }
  }

  return <>Match not found</>
}
