import { type MatchModel, MatchSide } from '@/models/matches/Match'
import { formatDate } from '@/utils/timeFormat'
import { Flex, Stack, Text } from '@chakra-ui/react'
import { getResult } from '../helpers'

interface Props {
  match: MatchModel
  viewerSide: MatchSide | null
}

const sides = {
  [MatchSide.Black]: 'black',
  [MatchSide.White]: 'white',
} as const

export function Header({ match, viewerSide }: Props) {
  if (viewerSide === null)
    return (
      <Stack gap="0">
        <Flex alignItems="center" gap="10px">
          <Text fontSize={['20px', '26px']}>
            Partida de{' '}
            <Text as="span" fontWeight={700}>
              {match.white.name}
            </Text>{' '}
            contra{' '}
            <Text as="span" fontWeight={700}>
              {match.black.name}
            </Text>{' '}
          </Text>
        </Flex>
        <Text fontSize={['12px', '14px']}>{formatDate(match.timestamp)}</Text>
        <Text color="blackAlpha.600" fontSize={['10px', '12px']}>
          Id: {match._id}
        </Text>
      </Stack>
    )

  const viewerResult = getResult(match, viewerSide)
  const viewerMatchPlayer = match[sides[viewerSide]]
  const oponentMatchPlayer = match[sides[(1 - viewerSide) as MatchSide]]

  return (
    <Stack gap="0">
      <Flex alignItems="center" gap="10px">
        <Text
          fontSize={['20px', '26px']}
          color={
            viewerResult === 'victory'
              ? 'green.500'
              : viewerResult === 'draw'
                ? 'gray.500'
                : 'red.500'
          }
        >
          <Text fontWeight={700} as="span">
            {viewerResult === 'victory'
              ? 'Vitória'
              : viewerResult === 'draw'
                ? 'Empate'
                : 'Derrota'}
          </Text>{' '}
          contra {oponentMatchPlayer.name}
        </Text>
        <Text
          fontSize={['14px', '16px']}
          fontWeight={600}
          color={
            viewerMatchPlayer.gain > 0
              ? 'green.500'
              : viewerMatchPlayer.gain === 0
                ? 'gray.500'
                : 'red.500'
          }
        >
          ({viewerMatchPlayer.gain < 0 ? '-' : '+'}
          {Math.abs(viewerMatchPlayer.gain).toFixed()} SR)
        </Text>
      </Flex>
      <Text fontWeight={500} fontSize={['18px', '20px']}>
        Lado{' '}
        <Text
          as="span"
          fontWeight={700}
          color={viewerSide === MatchSide.White ? 'blue.400' : 'red.400'}
        >
          {viewerSide === MatchSide.White ? 'Azul' : 'Vermelho'}
        </Text>
      </Text>
      <Text fontSize={['12px', '14px']}>{formatDate(match.timestamp)}</Text>
      <Text color="blackAlpha.600" fontSize={['10px', '12px']}>
        Id: {match._id}
      </Text>
    </Stack>
  )
}
