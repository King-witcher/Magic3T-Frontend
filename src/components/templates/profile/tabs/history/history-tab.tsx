import { MatchSide } from '@/models/matches/Match'
import { matchesQueryOptions } from '@/utils/query-options'
import { getAcrylicProps } from '@/utils/style-helpers'
import { Center, Stack, chakra, keyframes } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { HistoryRow } from './history-row'

interface Props {
  referenceUid: string
}

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export function HistoryTab({ referenceUid }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const {
    data: matches,
    refetch,
    isFetching,
    isPending,
  } = useQuery({
    ...matchesQueryOptions(referenceUid),
    enabled: false,
  })

  useEffect(() => {
    if (isPending && !isFetching) {
      refetch()
    }
  }, [isPending, isFetching, refetch])

  return matches?.length ? (
    <Stack
      h="100%"
      rounded="10px"
      {...getAcrylicProps()}
      bg="none"
      gap="0"
      divider={
        <chakra.hr
          m="0 !important"
          borderTopWidth="1px"
          borderBottom="0px"
          p="0"
          borderColor="#ffffff80"
        />
      }
      overflow="hidden"
    >
      {matches.map((match, matchIndex) => {
        const delay = (0.5 * matchIndex) / matches.length
        const referenceSide =
          match.white.uid === referenceUid ? MatchSide.White : MatchSide.Black

        return (
          // <Link key={match._id} to={`${match._id}`}>
          <HistoryRow
            key={match._id}
            referenceSide={referenceSide}
            isExpanded={matchIndex === expandedIndex}
            onClick={() => setExpandedIndex(matchIndex)}
            animation={`${appear} ${delay}s ease-in`}
            match={match}
          />
          // </Link>
        )
      })}
    </Stack>
  ) : (
    <Center h="full" fontSize="20px" textAlign="center">
      Nenhuma partida encontrada.
    </Center>
  )
}
