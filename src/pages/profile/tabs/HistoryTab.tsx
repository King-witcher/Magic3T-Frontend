import { Center, Spinner, Stack } from '@chakra-ui/react'
import { User } from 'firebase/auth'

import HistoryMatch from '../components/HistoryMatch'
import { Match } from '@/models/matches/Match'
import { Loader } from '@/hooks/useAsync'
import { Link, useParams } from 'react-router-dom'
import HistoryMatchTab from './HistoryMatchTab'
import { UserData } from '@/models/users/User'
import { useQueryParams } from '@/hooks/useQueryParams'
import { useId } from 'react'

interface Props {
  matches: Match[]
}

type Params = {
  matchId?: string
}

export default function HistoryTab({ matches }: Props) {
  const { matchId } = useParams<Params>()

  const params = useQueryParams()
  const uidParam = params.get('uid')

  if (matchId) return <HistoryMatchTab matchId={matchId} />

  return matches.length ? (
    <Stack h="100%">
      {matches.map((match, index) => (
        <Link
          key={index}
          to={
            uidParam
              ? `/profile/history/${match._id}?uid=${uidParam}`
              : `/profile/history/${match._id}`
          }
        >
          <HistoryMatch match={match} />
        </Link>
      ))}
    </Stack>
  ) : (
    <Center h="full" fontSize="20px" textAlign="center">
      Nenhuma partida para mostrar.
    </Center>
  )
}
