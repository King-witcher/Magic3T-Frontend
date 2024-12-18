import { HistoryMatchEventsEnum, type MatchModel, MatchSide } from '@/models'
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
  const opponent = [match.white, match.black][1 - referenceSide]

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
              result === 'defeat'
                ? '#ff3040'
                : result === 'draw'
                  ? 'light'
                  : '#40cf40'
            }
          >
            {/* ({match.mode === 'ranked' ? 'Ranqueada' : 'Casual'}){' '} */}
            {result === 'victory'
              ? 'Victory'
              : result === 'draw'
                ? 'Draw'
                : 'Defeat'}

            {player.gain !== 0 && (
              <>
                {' '}
                ({player.gain > 0 ? '+' : '-'}
                {Math.abs(Math.round(player.gain))})
              </>
            )}
          </Text>
          •<Text fontSize={['10px', '16px']}>{opponent.name}</Text>
        </Flex>
        <Text fontSize={['10px', '16px']}>{formatDate(match.timestamp)}</Text>
      </Flex>
      <Flex gap="5px">
        {match.events.map((event) => (
          <Center
            px="6px"
            key={`${event.event}-${event.choice}`}
            borderRadius="3px"
            minW="20px"
            h="20px"
            {...(event.event === HistoryMatchEventsEnum.Forfeit
              ? {}
              : event.event === HistoryMatchEventsEnum.Timeout
                ? {}
                : event.side === MatchSide.White
                  ? {
                      bg: '#3787ffc0',
                      border: '1px solid #3787ff',
                      boxShadow: '0 0 10px 0 #3787ff80',
                    }
                  : {
                      bg: '#ff3737c0',
                      border: '1px solid #ff3737',
                      boxShadow: '0 0 10px 0 #ff373780',
                    })}
          >
            {event.event === HistoryMatchEventsEnum.Choice && event.choice}
            {event.event === HistoryMatchEventsEnum.Forfeit && 'Surrender'}
            {event.event === HistoryMatchEventsEnum.Timeout && 'Timeout'}
          </Center>
        ))}
      </Flex>
    </Flex>
  )
}
