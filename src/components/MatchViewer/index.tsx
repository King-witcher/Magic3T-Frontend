import { useAuth } from '@/contexts/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { NotFoundError } from '@/models/errors/NotFoundError'
import { users } from '@/models/users'
import { getEloUrl } from '@/utils/getEloUrl'
import {
  Avatar,
  Box,
  Center,
  Flex,
  Stack,
  Text,
  Image,
  VStack,
  Divider,
} from '@chakra-ui/react'
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
  const [oponentProfile] = useAsync(async () => {
    try {
      if (match && user) {
        return models.users.getbyId(
          match.black.uid === user._id ? match.white.uid : match.black.uid,
        )
      }
    } catch (e) {
      if (e instanceof NotFoundError) {
        setError('Oponent not found')
        return null
      }
    }
  }, [match])

  if (!match || !user) return null

  const side = match.black.uid === user._id ? 'black' : 'white'

  const result =
    match.winner === 'none'
      ? 'draw'
      : match[match.winner].uid === user._id
      ? 'victory'
      : 'defeat'

  const currentPlayer = match.black.uid === user._id ? match.black : match.white
  const oponent = match.black.uid === user._id ? match.white : match.black
  const contextColor =
    result === 'victory' ? 'green' : result === 'defeat' ? 'red' : 'gray'

  return (
    <Stack
      borderLeft="solid 5px"
      borderLeftColor={contextColor + '.400'}
      p="20px"
      w="full"
      h="full"
      gap="0px"
      rounded="10px"
      bg={
        result === 'defeat'
          ? 'red.200'
          : result === 'draw'
          ? 'gray.200'
          : 'green.200'
      }
    >
      <Flex alignItems="center" gap="10px">
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
          {match.mode === 'casual' ? '(Casual) ' : '(Ranqueada) '}
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
      <Text fontSize={['12px', '14px']}>
        {match.timestamp.getDay()}/{match.timestamp.getUTCMonth()}/
        {match.timestamp.getUTCFullYear()}
      </Text>
      <VStack gap="40px" py="20px" justify="space-between" h="full">
        <Flex
          p="10px"
          rounded="10px"
          alignItems="center"
          gap="15px"
          bg="whiteAlpha.600"
        >
          <Avatar size="lg" src={oponentProfile?.photoURL} />
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
        <Flex
          gap={['8px 5px', '14px 8px']}
          flexWrap="wrap"
          justifyContent="center"
        >
          {match.moves.map((move, index) => (
            <Center
              px={['6px', '8px 10px']}
              key={index}
              borderRadius={['8px']}
              minW={['40px', '50px']}
              h={['40px', '50px']}
              fontSize={['16px', '20px']}
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
        <Flex
          p="10px"
          rounded="10px"
          alignItems="center"
          gap="15px"
          bg="whiteAlpha.600"
          border="solid 5px white"
          boxSizing="border-box"
        >
          <Avatar size="lg" src={user.photoURL} />
          <Flex flexDir="column">
            <Text>{currentPlayer.name}</Text>
            <Flex gap="5px" alignItems="center">
              <Image
                ml="3px"
                src={getEloUrl(currentPlayer.rating)}
                alt="rank"
                draggable={false}
              />
              {currentPlayer.rating.toFixed()}{' '}
              <Text
                color={
                  currentPlayer.rv > 0
                    ? 'green.400'
                    : currentPlayer.rv === 0
                    ? 'gray.400'
                    : 'red.400'
                }
              >
                ({currentPlayer.rv < 0 ? '-' : '+'}
                {Math.abs(currentPlayer.rv).toFixed()})
              </Text>{' '}
              SR
            </Flex>
          </Flex>
        </Flex>
      </VStack>
    </Stack>
  )
}
