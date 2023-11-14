import { Center, Spinner, Stack } from '@chakra-ui/react'
import { User } from 'firebase/auth'

import HistoryMatch from '../components/HistoryMatch'
import { Match } from '@/models/matches/Match'
import { Loader } from '@/hooks/useAsync'
import { Link, useParams } from 'react-router-dom'
import HistoryMatchTab from './HistoryMatchTab'
import { UserData } from '@/models/users/User'

interface Props {
  matchLoader: Loader<Match[]>
}

type Params = {
  matchId?: string
}

export default function HistoryTab({ matchLoader: [matches, loading] }: Props) {
  const { matchId } = useParams<Params>()

  if (matchId) return <HistoryMatchTab matchId={matchId} />

  if (!loading && matches)
    return (
      <Stack h="100%">
        {matches.map((match, index) => (
          <Link key={index} to={`/profile/history/${match._id}`}>
            <HistoryMatch match={match} />
          </Link>
        ))}
      </Stack>
    )
  else
    return (
      <Center h="100%">
        <Spinner color="pink.400" size="xl" thickness="5px" />
      </Center>
    )
}
