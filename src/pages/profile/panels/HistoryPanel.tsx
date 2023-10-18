import { firestore } from '@/services/firebase'
import {
  Box,
  Center,
  Divider,
  Flex,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'
import { MatchRegistry } from './MatchRegistry'
import {
  collection,
  getDocs,
  or,
  query,
  where,
  orderBy,
} from 'firebase/firestore/lite'
import { formatTime } from '@/lib/utils'
import HistoryMatch from '../components/HistoryMatch'

interface Props {
  user: User
}

const rowColors = {
  victory: 'green.200',
  draw: 'gray.200',
  defeat: 'red.200',
}

export default function HistoryPanel({ user }: Props) {
  const [matches, setMatches] = useState<MatchRegistry[] | 'loading'>('loading')

  const fetchDocs = useCallback(async () => {
    const col = collection(firestore, 'matches')
    const q = query(
      col,
      or(
        where('black.uid', '==', user.uid),
        where('white.uid', '==', user.uid)
      ),
      orderBy('timestamp', 'desc')
    )
    const snapshot = await getDocs(q)
    const result: MatchRegistry[] = []
    snapshot.forEach((docRef) => {
      result.push(docRef.data() as MatchRegistry)
    })
    console.log(result)
    setMatches(result)
  }, [user])

  useEffect(() => {
    fetchDocs()
  }, [user])

  if (matches !== 'loading')
    return (
      <Stack>
        {matches.map((match, index) => (
          <HistoryMatch key={index} match={match} />
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
