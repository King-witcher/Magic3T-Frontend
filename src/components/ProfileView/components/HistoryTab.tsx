import { Center, Divider, chakra, Stack, keyframes } from '@chakra-ui/react'

import HistoryMatch from './HistoryMatch'
import { Match } from '@/models/matches/Match'
import { Link } from 'react-router-dom'

interface Props {
  matches: Match[]
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

export default function HistoryTab({ matches, referenceUid }: Props) {
  return matches.length ? (
    <Stack
      h="100%"
      bg=""
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
      // border="1px solid"
      borderColor="gray.400"
      overflow="hidden"
    >
      {matches.map((match, index) => {
        const delay = (0.5 * index) / matches.length

        return (
          <Link key={match._id} to={`${match._id}`}>
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
