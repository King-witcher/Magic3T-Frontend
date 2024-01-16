import { Center, Stack, keyframes } from '@chakra-ui/react'

import HistoryMatch from './HistoryMatch'
import { Match } from '@/models/matches/Match'
import { Link } from 'react-router-dom'

interface Props {
  matches: Match[]
  referenceUid: string
}

type Params = {
  matchId?: string
}

const appear = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

export default function HistoryTab({ matches, referenceUid }: Props) {
  return matches.length ? (
    <Stack h="100%">
      {matches.map((match, index) => {
        const delay = (0.5 * index) / matches.length

        return (
          <Link key={index} to={`${match._id}`}>
            <HistoryMatch
              referenceUid={referenceUid}
              animation={`${appear} ${delay}s ease-in`}
              match={match}
            />
          </Link>
        )
      })}
    </Stack>
  ) : (
    <Center h="full" fontSize="20px" textAlign="center">
      Nenhuma partida encontrada.
    </Center>
  )
}
