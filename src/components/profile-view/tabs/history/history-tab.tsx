import { type MatchModel, MatchSide } from '@/models/matches/Match'
import { Center, Stack, chakra, keyframes } from '@chakra-ui/react'
import { useState } from 'react'
import { HistoryRow } from './history-row'

interface Props {
  matches: MatchModel[]
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

export function HistoryTab({ matches, referenceUid }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  function expand(index: number) {
    setExpandedIndex(index)
  }

  return matches.length ? (
    <Stack
      h="100%"
      rounded="10px"
      gap="0"
      boxShadow="0 0 10px 8px #00000010"
      divider={
        <chakra.hr
          m="0 !important"
          borderTopWidth="1px"
          borderBottom="0px"
          p="0"
          borderColor="gray.300"
        />
      }
      borderColor="gray.400"
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
            onClick={() => expand(matchIndex)}
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
