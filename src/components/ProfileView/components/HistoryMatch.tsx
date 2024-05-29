import { Center, Flex, FlexProps, Text } from '@chakra-ui/react'
import { formatDate } from '@/utils/timeFormat'
import {
  HistoryMatchEventsEnum,
  Match,
  SidesEnum,
} from '@/models/matches/Match'

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
  const result =
    match.winner === null
      ? 'draw'
      : [match.white, match.black][match.winner].uid === referenceUid
      ? 'victory'
      : 'defeat'

  //const timeMs = match.moves[match.moves.length - 1].time
  //const timeFmt = formatTime(timeMs)

  const playerSide =
    match.white.uid === referenceUid ? SidesEnum.White : SidesEnum.Black
  const player = [match.white, match.black][playerSide]
  const oponent = [match.white, match.black][1 - playerSide]

  return (
    <Flex
      flexDir="column"
      gap="10px"
      p={['10px 15px', '10px 20px']}
      bg={'gray.100'}
      transition="background 80ms linear"
      _hover={{
        bgColor: 'gray.200',
        borderColor:
          result === 'defeat'
            ? 'red.300'
            : result === 'draw'
            ? 'gray.300'
            : 'green.300',
      }}
      borderLeft="solid 10px"
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

            {player.gain !== 0 && (
              <>
                {' '}
                ({player.gain > 0 ? '+' : '-'}
                {Math.abs(Math.round(player.gain))})
              </>
            )}
          </Text>
          •<Text fontSize={['10px', '16px']}>{oponent.name}</Text>
        </Flex>
        <Text fontSize={['10px', '16px']}>{formatDate(match.timestamp)}</Text>
      </Flex>
      <Flex gap="5px">
        {match.events.map((event, index) => (
          <Center
            px="6px"
            key={index}
            borderRadius="3px"
            minW="20px"
            h="20px"
            bg={
              event.event === HistoryMatchEventsEnum.Forfeit
                ? 'red.500'
                : event.event === HistoryMatchEventsEnum.Timeout
                ? 'yellow.500'
                : event.side === playerSide
                ? 'blue.300'
                : 'red.300'
            }
          >
            {event.event === HistoryMatchEventsEnum.Choice && event.choice}
            {event.event === HistoryMatchEventsEnum.Forfeit && 'Forfeit'}
            {event.event === HistoryMatchEventsEnum.Timeout && 'Timeout'}
          </Center>
        ))}
      </Flex>
    </Flex>
  )
}
