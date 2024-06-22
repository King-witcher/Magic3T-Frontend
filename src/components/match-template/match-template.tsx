import { Flex, Stack, VStack } from '@chakra-ui/react'
import { MatchModel, MatchSide } from '@/models/matches/Match'
import { MatchResult } from '@/types'
import { getResult, getSide } from './helpers'
import { Header, MovesView, PlayerCard } from './components'

interface Props {
  match: MatchModel
  viewAs?: string
}

export function MatchTemplate({ match, viewAs }: Props) {
  const viewerSide = viewAs ? getSide(match, viewAs) : null
  const viewerResult = viewerSide !== null ? getResult(match, viewerSide) : null

  const borderColor =
    viewerResult === MatchResult.Victory
      ? 'green.400'
      : viewerResult === MatchResult.Defeat
        ? 'red.400'
        : 'gray.400'

  return (
    <Stack
      borderLeft="solid 5px"
      borderLeftColor={borderColor}
      p="20px"
      inset="0"
      pos="absolute"
      gap="0px"
      rounded="10px"
      bg="gray.100"
    >
      <Header match={match} viewerSide={viewerSide} />

      <VStack gap="40px" py="20px" justify="space-between" h="full">
        <PlayerCard
          matchPlayer={match.black}
          highlight={viewerSide !== MatchSide.White ? 'red' : null}
        />
        <Flex
          gap={['8px 5px', '14px 8px']}
          flexWrap="wrap"
          w="full"
          justifyContent="center"
        >
          <MovesView moves={match.events} />
        </Flex>
        <PlayerCard
          matchPlayer={match.white}
          highlight={viewerSide !== MatchSide.Black ? 'blue' : null}
        />
      </VStack>
    </Stack>
  )
}
