import { useAuth } from '@/contexts/AuthContext'
import { Center, Flex, FlexProps, Text } from '@chakra-ui/react'
import { formatDate } from '@/utils/timeFormat'
import { Match } from '@/models/matches/Match'

interface Props extends FlexProps {
  match: Match
  referenceUid: string
}

const rowColors = {
  victory: 'green.200',
  draw: 'gray.200',
  defeat: 'red.200',
}

export default function HistoryMatch({ match, referenceUid, ...rest }: Props) {
  const { user } = useAuth()
  if (!user) return null

  const result =
    match.winner === 'none'
      ? 'draw'
      : match[match.winner].uid === referenceUid
      ? 'victory'
      : 'defeat'

  //const timeMs = match.moves[match.moves.length - 1].time
  //const timeFmt = formatTime(timeMs)

  const playerSide = match.white.uid === referenceUid ? 'white' : 'black'
  const player = match[playerSide]
  const oponent = player === match.white ? match.black : match.white

  return (
    <Flex
      flexDir="column"
      gap="10px"
      p={['10px 15px', '10px 20px']}
      borderRadius="10px"
      bg={rowColors[result]}
      transition="background 80ms linear"
      _hover={{
        bgColor:
          result === 'defeat'
            ? 'red.100'
            : result === 'draw'
            ? 'gray.100'
            : 'green.100',
        borderColor:
          result === 'defeat'
            ? 'red.300'
            : result === 'draw'
            ? 'gray.300'
            : 'green.300',
      }}
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
      {...rest}
    >
      <Flex
        gap={['5px', '10px']}
        alignItems="center"
        justifyContent="space-between"
        overflow="hidden"
      >
        <Flex gap="5px" alignItems="center">
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
            {/* ({match.mode === 'ranked' ? 'Ranqueada' : 'Casual'}){' '} */}
            {result === 'victory'
              ? 'Vitória'
              : result === 'draw'
              ? 'Empate'
              : 'Derrota'}

            {player.rv !== 0 && (
              <>
                {' '}
                ({player.rv > 0 ? '+' : '-'}
                {Math.abs(Math.round(player.rv))})
              </>
            )}
          </Text>
          •<Text fontSize={['10px', '16px']}>{oponent.name}</Text>
        </Flex>
        <Text fontSize={['10px', '16px']}>{formatDate(match.timestamp)}</Text>
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
                : move.player === playerSide
                ? 'blue.300'
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
