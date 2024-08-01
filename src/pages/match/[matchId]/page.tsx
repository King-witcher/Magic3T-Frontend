import { MatchTemplate } from '@/components/match-template'
import { models } from '@/models'
import { Center, Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export function MatchPage() {
  const { matchId } = useParams() as { matchId: string }

  async function getMatch() {
    return await models.matches.getById(matchId)
  }

  const matchQuery = useQuery({
    queryKey: ['match', matchId],
    staleTime: Number.POSITIVE_INFINITY,
    queryFn: getMatch,
  })

  if (matchQuery.isPending) {
    return (
      <Center h="full">
        <Spinner />
      </Center>
    )
  }

  if (!matchQuery.data) {
    return <Center h="full">Partida não encontrada</Center>
  }

  return <MatchTemplate match={matchQuery.data} />
}
