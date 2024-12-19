import { HistoryMatchEventsEnum, MatchModel, MatchSide } from '@/models'
import { MatchResult } from '@/types'
import { getAcrylicProps } from '@/utils/style-helpers'
import { Center, Flex, Stack, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { FaClock } from 'react-icons/fa'
import { RiFlagFill } from 'react-icons/ri'

interface Props {
  match: MatchModel
  viewAs: string
}

const resultColorMap: Record<MatchResult, string> = {
  [MatchResult.Defeat]: '#c02040',
  [MatchResult.Draw]: '#b0b0c0',
  [MatchResult.Victory]: '#00c020',
}

const dateTimeFormat = Intl.DateTimeFormat()

export function MatchRow({ match, viewAs }: Props) {
  const side = match.black.uid === viewAs ? MatchSide.Black : MatchSide.White
  const result =
    match.winner === null
      ? MatchResult.Draw
      : match.winner === side
        ? MatchResult.Victory
        : MatchResult.Defeat

  const player = match.white.uid === viewAs ? match.white : match.black
  const opponent = match.white.uid === viewAs ? match.black : match.white

  const durationString = useMemo(() => {
    const duration = Math.floor(
      match.events[match.events.length - 1].time / 1000
    )
    const secs = duration % 60
    const mins = (duration - secs) / 60

    if (mins > 0) return `${mins}m ${secs}s`
    return `${secs}s`
  }, [match])

  return (
    <Stack
      as={Link}
      to={`/user/${opponent.uid}`}
      gap="10px"
      p="20px"
      transition="all 100ms"
      cursor="pointer"
      {...getAcrylicProps()}
      _hover={{
        bgColor: '#ffffff40',
      }}
    >
      <Flex>
        <Stack spacing={0}>
          <Flex align="center" gap="10px">
            <Text fontWeight={700}>{opponent.name}</Text>
            {!!player.gain && (
              <Text
                fontSize="0.875rem"
                fontWeight={700}
                lineHeight="normal"
                color={player.gain > 0 ? '#00c020' : '#ff4000'}
              >
                {player.gain > 0 ? '+' : '-'}
                {Math.round(Math.abs(player.gain))}
              </Text>
            )}
          </Flex>
          <Text fontSize="0.75rem" opacity={0.7}>
            {dateTimeFormat.format(match.timestamp)} - {durationString}
          </Text>
        </Stack>
        <Center
          ml="auto"
          rounded="9990"
          textTransform="capitalize"
          color={result === MatchResult.Defeat ? 'light' : '#000000'}
          fontWeight={700}
          fontSize="0.875rem"
          w="80px"
          h="25px"
          bgColor={resultColorMap[result]}
        >
          {result}
        </Center>
      </Flex>
      <Flex gap={{ base: '8px', sm: '10px' }}>
        {match.events.map((event) => {
          const bgColor =
            event.side === MatchSide.White ? 'blue.400' : 'red.400'

          if (event.event === HistoryMatchEventsEnum.Message) return null

          return (
            <Center
              h={{ base: '22px', sm: '25px' }}
              w={{ base: '22px', sm: '25px' }}
              {...getAcrylicProps()}
              borderWidth="2px"
              borderColor={bgColor}
              lineHeight="normal"
              rounded="8px"
              fontSize="0.875rem"
              key={event.time}
            >
              {event.choice}
              {event.event === HistoryMatchEventsEnum.Forfeit && <RiFlagFill />}
              {event.event === HistoryMatchEventsEnum.Timeout && <FaClock />}
            </Center>
          )
        })}
      </Flex>
    </Stack>
  )
}
