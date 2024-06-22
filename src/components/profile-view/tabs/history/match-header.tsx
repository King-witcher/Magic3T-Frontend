import { HistoryMatchEventsEnum, MatchModel, MatchSide } from '@/models'
import { MatchResult } from '@/types'
import { formatDate } from '@/utils/timeFormat'
import { Center, Flex, Text } from '@chakra-ui/react'

interface Props {
  match: MatchModel
  referenceSide: MatchSide
}

export function MatchHeader({ match, referenceSide }: Props) {
  const result: MatchResult =
    match.winner === null
      ? MatchResult.Draw
      : referenceSide === match.winner
        ? MatchResult.Victory
        : MatchResult.Defeat

  const player = [match.white, match.black][referenceSide]
  const oponent = [match.white, match.black][1 - referenceSide]

  return (
    <Flex flexDir="column" gap="10px">
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
                  : event.side === referenceSide
                    ? 'blue.300'
                    : 'red.300'
            }
          >
            {event.event === HistoryMatchEventsEnum.Choice && event.choice}
            {event.event === HistoryMatchEventsEnum.Forfeit && 'Rendição'}
            {event.event === HistoryMatchEventsEnum.Timeout && 'Timeout'}
          </Center>
        ))}
      </Flex>
    </Flex>
  )
}
