import { useRatingInfo } from '@/hooks/use-rating-info'
import { MatchDto, MatchEventType, Team } from '@/services/nest-api'
import { MatchResult } from '@/types'
import { getAcrylicProps } from '@/utils/style-helpers'
import { Center, Flex, Stack, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { FaClock } from 'react-icons/fa'
import { RiFlagFill } from 'react-icons/ri'

interface Props {
  match: MatchDto
  viewAs: string
}

const resultColorMap: Record<MatchResult, string> = {
  [MatchResult.Defeat]: '#c02040',
  [MatchResult.Draw]: '#b0b0c0',
  [MatchResult.Victory]: '#00c020',
}

const dateTimeFormat = Intl.DateTimeFormat()

export function MatchRow({ match, viewAs }: Props) {
  const { convertToLp } = useRatingInfo()

  const team = match.teams[Team.Order].id === viewAs ? Team.Order : Team.Chaos
  const result =
    match.winner === null
      ? MatchResult.Draw
      : match.winner === team
        ? MatchResult.Victory
        : MatchResult.Defeat

  const player =
    match.teams[Team.Order].id === viewAs
      ? match.teams[Team.Order]
      : match.teams[Team.Chaos]
  const opponent =
    match.teams[Team.Order].id === viewAs
      ? match.teams[Team.Chaos]
      : match.teams[Team.Order]

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
      to={`/user/${opponent.id}`}
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
            <Text fontWeight={700}>{opponent.nickname}</Text>
            {!!player.ratingGain && (
              <Text
                fontSize="0.875rem"
                fontWeight={700}
                lineHeight="normal"
                color={player.ratingGain > 0 ? '#00c020' : '#ff4000'}
              >
                {player.ratingGain > 0 ? '+' : '-'}
                {Math.abs(convertToLp(player.ratingGain))}
              </Text>
            )}
          </Flex>
          <Text fontSize="0.75rem" opacity={0.7}>
            {dateTimeFormat.format(match.time)} - {durationString}
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
          const bgColor = event.side === Team.Order ? 'blue.400' : 'red.400'

          if (event.event === MatchEventType.Message) return null

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
              {event.event === MatchEventType.Choice && event.choice}
              {event.event === MatchEventType.Forfeit && <RiFlagFill />}
              {event.event === MatchEventType.Timeout && <FaClock />}
            </Center>
          )
        })}
      </Flex>
    </Stack>
  )
}
