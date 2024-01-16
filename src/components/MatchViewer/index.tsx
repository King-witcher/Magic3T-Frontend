import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { Flex, Stack, VStack } from '@chakra-ui/react'
import { Match } from '@/models/matches/Match'
import PlayerCard from './components/PlayerCard'
import MovesView from './components/MovesView'
import Header from './components/Header'

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
  const borderColor =
    referenceResult === 'victory'
      ? 'green.400'
      : referenceResult === 'defeat'
      ? 'red.400'
      : 'gray.400'

  return (
    <Stack
      borderLeft="solid 5px"
      borderLeftColor={borderColor}
      p="20px"
      w="full"
      h="full"
      gap="0px"
      rounded="10px"
      bg={'gray.100'}
    >
      <Header match={match} referenceSide={referenceSide} />

      <VStack gap="40px" py="20px" justify="space-between" h="full">
        <PlayerCard
          user={blackProfile}
          matchPlayer={match.black}
          highlight={referenceSide === 'black' ? 'red' : null}
        />
        <Flex
          gap={['8px 5px', '14px 8px']}
          flexWrap="wrap"
          justifyContent="center"
        >
          <MovesView moves={match.moves} />
        </Flex>
        <PlayerCard
          user={whiteProfile}
          matchPlayer={match.white}
          highlight={referenceSide === 'white' ? 'blue' : null}
        />
      </VStack>
    </Stack>
  )
}
