import { useAuth } from '@/contexts/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { NotFoundError } from '@/models/errors/NotFoundError'
import { getEloUrl } from '@/utils/getEloUrl'
import { Avatar, Box, Center, Flex, Stack, Text, Image } from '@chakra-ui/react'
import { useMemo, useState } from 'react'

interface Props {
  match: string
}

const rowColors = {
  victory: 'green.200',
  draw: 'gray.200',
  defeat: 'red.200',
}

export default function MatchViewer({ match: matchId }: Props) {
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [match, loading] = useAsync(async () => {
    try {
      return await models.matches.getById(matchId)
    } catch (e) {
      if (e instanceof NotFoundError) {
        setError('Match not found')
        return null
      }
    }
  })
  if (!match || !user) return 'match'

  const side = match.black.uid === user._id ? 'black' : 'white'

  const result =
    match.winner === 'none'
      ? 'draw'
      : match[match.winner].uid === user._id
      ? 'victory'
      : 'defeat'

  const currentPlayer = match.black.uid === user._id ? match.black : match.white
  const oponent = match.black.uid === user._id ? match.white : match.black

  return (
    <Stack
      w="full"
      h="full"
      gap="30px"
      alignItems="center"
      justifyContent="space-around"
    >
      <Flex alignItems="center" gap="10px">
        <Text fontSize={['20px', '26px']} fontWeight="700">
          {match.mode === 'casual' ? '(Casual)' : '(Ranqueada)'}
        </Text>
        •
        <Text
          fontSize={['20px', '26px']}
          fontWeight={700}
          color={
            result === 'victory'
              ? 'green.600'
              : result === 'draw'
              ? 'gray.500'
              : 'red.600'
          }
        >
          {result === 'victory'
            ? 'Vitória'
            : result === 'draw'
            ? 'Empate'
            : 'Derrota'}
        </Text>
        •
        <Text
          fontSize={16}
          fontWeight={600}
          color={
            currentPlayer.rv > 0
              ? 'green.400'
              : currentPlayer.rv === 0
              ? 'gray.400'
              : 'red.400'
          }
        >
          {currentPlayer.rv < 0 ? '-' : '+'}
          {Math.abs(currentPlayer.rv).toFixed()} SR
        </Text>
      </Flex>
      <Flex alignItems="center" gap="15px">
        <Avatar size="lg" />
        <Flex flexDir="column">
          <Text>{oponent.name}</Text>
          <Flex gap="5px" alignItems="center">
            <Image
              ml="3px"
              src={getEloUrl(oponent.rating)}
              alt="rank"
              draggable={false}
            />
            {oponent.rating.toFixed()}{' '}
            <Text
              color={
                oponent.rv > 0
                  ? 'green.400'
                  : oponent.rv === 0
                  ? 'gray.400'
                  : 'red.400'
              }
            >
              ({oponent.rv < 0 ? '-' : '+'}
              {Math.abs(oponent.rv).toFixed()})
            </Text>{' '}
            SR
          </Flex>
        </Flex>
      </Flex>
      <Flex gap="5px">
        {match.moves.map((move, index) => (
          <Center
            px="6px"
            key={index}
            borderRadius="3px"
            minW="24px"
            h="24px"
            bg={
              move.move === 'forfeit'
                ? 'red.500'
                : move.move === 'timeout'
                ? 'yellow.500'
                : move.player === side
                ? 'green.300'
                : 'red.300'
            }
          >
            {move.move}
          </Center>
        ))}
      </Flex>
    </Stack>
  )
}
