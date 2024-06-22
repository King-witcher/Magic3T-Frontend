import { MatchTemplate } from '@/components/match-template'
import { models } from '@/models'
import { Center, Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export default function MatchPage() {
  const { matchId } = useParams() as { matchId: string }

  const matchQuery = useQuery({
    queryKey: ['match', matchId],
    staleTime: Infinity,
    queryFn: getMatch,
  })

  async function getMatch() {
    return await models.matches.getById(matchId)
  }

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
