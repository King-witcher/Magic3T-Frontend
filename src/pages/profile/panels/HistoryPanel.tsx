import { firestore } from '@/services/firebase'
import { Center, Flex, Spinner, Stack, Text } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { useCallback, useEffect, useState } from 'react'
import { MatchRegistry } from './MatchRegistry'
import { collection, getDocs, or, query, where } from 'firebase/firestore/lite'

interface Props {
  user: User
}

const rowColors = {
  victory: 'green.300',
  draw: 'gray.200',
  defeat: 'red.300',
}

export default function HistoryPanel({ user }: Props) {
  const [matches, setMatches] = useState<MatchRegistry[] | 'loading'>('loading')

  const fetchDocs = useCallback(async () => {
    const col = collection(firestore, 'matches')
    const q = query(
      col,
      or(where('black.uid', '==', user.uid), where('white.uid', '==', user.uid))
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
        {matches.map((match, index) => {
          const result =
            match.winner === 'none'
              ? 'draw'
              : match[match.winner].uid === user.uid
              ? 'victory'
              : 'defeat'

          return (
            <Flex
              alignItems="center"
              h="60px"
              px="20px"
              borderRadius="10px"
              bg={rowColors[result]}
              color="black"
              justifyContent="space-between"
              userSelect="none"
            >
              <Text fontWeight="600">{match.white.name}</Text>
              <Text>vs</Text>
              <Text fontWeight="600">{match.black.name}</Text>
            </Flex>
          )
        })}
      </Stack>
    )
  else
    return (
      <Center h="100%">
        <Spinner color="pink.400" size="xl" thickness="5px" />
      </Center>
    )
}
