import { useCallback, useEffect } from 'react'
import { useMeContext } from '../../layout'
import MatchViewer from '@/components/MatchViewer'
import { useAuth } from '@/contexts/AuthContext'
import { redirect, useNavigate, useParams } from 'react-router-dom'
import { models } from '@/models'
import { useGuardedAuth } from '@/contexts/GuardedAuthContext'

export default function MeMatchPage() {
  const { user } = useGuardedAuth()

  const { matchId } = useParams()

  const navigate = useNavigate()

  const {
    lazyMatchLoader: [matches, loading, load],
  } = useMeContext()

  const searchAndRedirect = useCallback(async () => {
    // Get desperdiçado
    const match = await models.matches.getById(matchId || '')
    if (match) {
      navigate(`/match/${matchId}`)
    }
  }, [matchId])

  useEffect(() => {
    if (!matches && !loading) load()
  }, [matches, load])

  if (loading || !matches) return 'carregando'

  for (const match of matches) {
    if (match._id === matchId) {
      return <MatchViewer match={match} referenceUid={user._id} />
    }
  }

  searchAndRedirect()
  return <>Partida não encontrada.</>
}
