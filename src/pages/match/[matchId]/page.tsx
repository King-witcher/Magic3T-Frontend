import MatchViewer from '@/components/MatchViewer'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { Center } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'

export default function MatchPage() {
  const { matchId } = useParams() as { matchId: string }

  const [match, loading] = useAsync(async () => {
    return await models.matches.getById(matchId)
  }, [matchId])

  if (loading) {
    return <Center>Carregando partida</Center>
  }

  if (!match) {
    return <Center>Partida não encontrada</Center>
  }

  return <MatchViewer match={match} />
}
