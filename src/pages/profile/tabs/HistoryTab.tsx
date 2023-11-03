import { Center, Spinner, Stack } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'
import { MatchRegistry } from './MatchRegistry'

import HistoryMatch from '../components/HistoryMatch'
import { models } from '@/models'
import { WithId } from '@/types/WithId'
import { Match } from '@/models/matches/Match'
import { Loader } from '@/hooks/useAsync'
import { Link, useParams } from 'react-router-dom'
import HistoryMatchTab from './HistoryMatchTab'

interface Props {
  user: User
  matchLoader: Loader<WithId<Match>[]>
}

type Params = {
  matchId?: string
}

export default function HistoryTab({
  user,
  matchLoader: [matches, loading],
}: Props) {
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
