import { MatchTemplate } from '@/components/templates'
import { matchQueryOptions } from '@/utils/query-options'
import { Center, Spinner } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/match/$matchId')({
  component: Page,
})

export function Page() {
  const { matchId } = Route.useParams() as { matchId: string }

  const matchQuery = useQuery({
    ...matchQueryOptions(matchId),
    staleTime: Number.POSITIVE_INFINITY,
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
