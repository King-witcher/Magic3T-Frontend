import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { formatDate } from '@/utils/timeFormat'
import { Center, Flex, Stack, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { Match } from '@/models/matches/Match'
import PlayerCard from './components/PlayerCard'
import MovesView from './components/MovesView'

interface Props {
  match: Match
  referenceUid?: string
}

const rowColors = {
  victory: 'green.200',
  draw: 'gray.200',
  defeat: 'red.200',
}

export default function MatchViewer({ match, referenceUid }: Props) {
  const [error, setError] = useState<string | null>(null)

  const [whiteProfile] = useAsync(async () => {
    try {
      if (match) {
        return await models.users.getById(match.white.uid)
      }
    } catch (e: any) {
      console.error(e.message)
    }
  }, [match])

  const [blackProfile] = useAsync(async () => {
    if (match) {
      try {
        return await models.users.getById(match.black.uid)
      } catch (e: any) {
        console.error(e.message)
      }
    }
  }, [match])

  if (!match) return <>Partida não encontrada.</>

  const referenceSide = referenceUid
    ? referenceUid === match.white.uid
      ? 'white'
      : referenceUid === match.black.uid
      ? 'black'
      : null
    : null

  const referenceResult = referenceSide
    ? match.winner === 'none'
      ? 'draw'
      : match[match.winner].uid === referenceUid
      ? 'victory'
      : 'defeat'
    : null

  const referenceMatchPlayer =
    match.black.uid === referenceUid ? match.black : match.white
  const contextColor =
    referenceResult === 'victory'
      ? 'green'
      : referenceResult === 'defeat'
      ? 'red'
      : 'gray'

  return (
    <Stack
      borderLeft="solid 5px"
      borderLeftColor={contextColor + '.400'}
      p="20px"
      w="full"
      h="full"
      gap="0px"
      rounded="10px"
      bg={'gray.100'}
    >
      <Flex alignItems="center" gap="10px">
        <Text
          fontSize={['20px', '26px']}
          fontWeight={700}
          color={
            referenceResult === 'victory'
              ? 'green.600'
              : referenceResult === 'draw'
              ? 'gray.500'
              : 'red.600'
          }
        >
          {match.mode === 'casual' ? '(Casual) ' : '(Ranqueada) '}
          {referenceResult === 'victory'
            ? 'Vitória'
            : referenceResult === 'draw'
            ? 'Empate'
            : 'Derrota'}
        </Text>
        •
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
          {referenceMatchPlayer.rv < 0 ? '-' : '+'}
          {Math.abs(referenceMatchPlayer.rv).toFixed()} SR
        </Text>
      </Flex>
      <Text fontSize={['12px', '14px']}>{formatDate(match.timestamp)}</Text>

      {/* Perfil das pretas */}
      <VStack gap="40px" py="20px" justify="space-between" h="full">
        <PlayerCard
          user={blackProfile}
          matchPlayer={match.black}
          highlight={referenceSide === 'black'}
        />
        <Flex
          gap={['8px 5px', '14px 8px']}
          flexWrap="wrap"
          justifyContent="center"
        >
          {/* {match.moves.map((move, index) => (
            <Center
              px={['6px', '8px 10px']}
              key={index}
              borderRadius={['8px']}
              minW={['40px', '50px']}
              h={['40px', '50px']}
              fontSize={['16px', '20px']}
              bg={
                move.move === 'forfeit'
                  ? 'red.500'
                  : move.move === 'timeout'
                  ? 'yellow.500'
                  : move.player === 'white'
                  ? 'blue.300'
                  : 'red.300'
              }
            >
              {move.move}
            </Center>
          ))} */}
          <MovesView moves={match.moves} />
        </Flex>
        <PlayerCard
          user={whiteProfile}
          matchPlayer={match.white}
          highlight={referenceSide === 'white'}
        />
      </VStack>
    </Stack>
  )
}
