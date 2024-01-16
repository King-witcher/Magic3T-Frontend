import { Match } from '@/models/matches/Match'
import { formatDate } from '@/utils/timeFormat'
import { Flex, Stack, Text } from '@chakra-ui/react'
import { IoMdArrowRoundBack } from 'react-icons/io'

interface Props {
  match: Match
  referenceSide: 'white' | 'black' | null
}

export default function Header({ match, referenceSide }: Props) {
  if (!referenceSide)
    return (
      <Stack gap="0">
        <Flex alignItems="center" gap="10px">
          <Text fontSize={['20px', '26px']}>
            Partida de{' '}
            <Text as="span" fontWeight={700} color="blue.400">
              {match.white.name}
            </Text>{' '}
            contra{' '}
            <Text as="span" fontWeight={700} color="red.400">
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

  const referenceResult =
    match.winner === 'none'
      ? 'draw'
      : referenceSide === match.winner
      ? 'victory'
      : 'defeat'

  const referenceMatchPlayer = match[referenceSide]
  const oponentMatchPlayer =
    referenceSide === 'white' ? match.black : match.white

  return (
    <Stack gap="0">
      <Flex alignItems="center" gap="10px">
        <Text
          fontSize={['20px', '26px']}
          color={
            referenceResult === 'victory'
              ? 'green.500'
              : referenceResult === 'draw'
              ? 'gray.500'
              : 'red.500'
          }
        >
          <Text fontWeight={700} as={'span'}>
            {referenceResult === 'victory'
              ? 'Vitória'
              : referenceResult === 'draw'
              ? 'Empate'
              : 'Derrota'}
          </Text>{' '}
          contra {oponentMatchPlayer.name}
        </Text>
        <Text
          fontSize={['14px', '16px']}
          fontWeight={600}
          color={
            referenceMatchPlayer.rv > 0
              ? 'green.500'
              : referenceMatchPlayer.rv === 0
              ? 'gray.500'
              : 'red.500'
          }
        >
          ({referenceMatchPlayer.rv < 0 ? '-' : '+'}
          {Math.abs(referenceMatchPlayer.rv).toFixed()} SR)
        </Text>
      </Flex>
      <Text fontWeight={500} fontSize={['18px', '20px']}>
        Lado{' '}
        <Text
          as={'span'}
          fontWeight={700}
          color={referenceSide === 'white' ? 'blue.400' : 'red.400'}
        >
          {referenceSide === 'white' ? 'Azul' : 'Vermelho'}
        </Text>
      </Text>
      <Text fontSize={['12px', '14px']}>{formatDate(match.timestamp)}</Text>
      <Text color="blackAlpha.600" fontSize={['10px', '12px']}>
        Id: {match._id}
      </Text>
    </Stack>
  )
}
