import { useAuth } from '@/contexts/AuthContext'
import { MatchRegistry } from '../panels/MatchRegistry'
import { formatTime } from '@/lib/utils'
import { Box, Center, Divider, Flex, Stack, Text } from '@chakra-ui/react'
import { useMemo } from 'react'

interface Props {
  match: MatchRegistry
}

const rowColors = {
  victory: 'green.200',
  draw: 'gray.200',
  defeat: 'red.200',
}

export default function ({ match }: Props) {
  const { user } = useAuth()
  if (!user) return null

  const result =
    match.winner === 'none'
      ? 'draw'
      : match[match.winner].uid === user.uid
      ? 'victory'
      : 'defeat'

  const timeMs = match.moves[match.moves.length - 1].time
  const timeFmt = formatTime(timeMs)

  const side = useMemo(() => {
    if (match.white.uid === user.uid) return 'white'
    else return 'black'
  }, [user])

  const oponentSide = useMemo(() => {
    if (side === 'white') return 'black'
    else return 'white'
  }, [side])

  return (
    <Flex
      flexDir="column"
      gap="10px"
      p={['10px 15px', '10px 20px']}
      borderRadius="10px"
      bg={rowColors[result]}
      borderLeft="solid 5px"
      borderLeftColor={
        result === 'defeat'
          ? 'red.400'
          : result === 'draw'
          ? 'gray.400'
          : 'green.400'
      }
      color="#000000c0"
      userSelect="none"
      fontSize={{
        base: '11px',
        sm: '16px',
      }}
      lineHeight={{
        base: '11px',
        sm: '16px',
      }}
    >
      <Flex gap={['5px', '10px']} alignItems="center">
        <Text
          fontWeight={700}
          color={
            result === 'victory'
              ? 'green.700'
              : result === 'draw'
              ? 'gray.600'
              : 'red.700'
          }
        >
          {result === 'victory'
            ? 'Vitória'
            : result === 'draw'
            ? 'Empate'
            : 'Derrota'}
        </Text>
        <Text fontSize={['10px', '16px']}>
          {match[oponentSide].name} ({match[oponentSide].rating} SR)
        </Text>

        <Text fontSize={['10px', '16px']}>1m12s</Text>

        <Text fontSize={['10px', '16px']}>18/10/2023</Text>
      </Flex>
      <Flex gap="5px">
        {match.moves.map((move, index) => (
          <Center
            px="6px"
            key={index}
            borderRadius="3px"
            minW="20px"
            h="20px"
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
    </Flex>
  )
}
