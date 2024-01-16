import { useAuth } from '@/contexts/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { NotFoundError } from '@/models/errors/NotFoundError'
import { formatDate } from '@/utils/timeFormat'
import {
  Avatar,
  Box,
  Center,
  Flex,
  Stack,
  Text,
  Image,
  VStack,
  LinkOverlay,
  LinkBox,
  Badge,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useQueryParams } from '@/hooks/useQueryParams'
import { Link } from 'react-router-dom'
import { useRankInfo } from '@/hooks/useRanks'
import { Match } from '@/models/matches/Match'

type Props =
  | {
      match?: undefined
      matchId: string
      referenceUid?: string
    }
  | {
      match: Match
      matchId?: undefined
      referenceUid: string
    }

const rowColors = {
  victory: 'green.200',
  draw: 'gray.200',
  defeat: 'red.200',
}

export default function MatchViewer({
  match: propsMatch,
  matchId,
  referenceUid,
}: Props) {
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const { getRankThumbnail } = useRankInfo()

  const [match, loading] = useAsync(async () => {
    if (propsMatch) {
      return propsMatch
    }

    try {
      return await models.matches.getById(matchId)
    } catch (e) {
      if (e instanceof NotFoundError) {
        setError('Match not found')
        return null
      }
    }
  })

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

  const currentPlayer =
    match.black.uid === referenceUid ? match.black : match.white
  const oponent = match.black.uid === referenceUid ? match.white : match.black
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
      bg={
        referenceResult === 'defeat'
          ? 'red.200'
          : referenceResult === 'draw'
          ? 'gray.200'
          : 'green.200'
      }
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
            currentPlayer.rv > 0
              ? 'green.500'
              : currentPlayer.rv === 0
              ? 'gray.500'
              : 'red.500'
          }
        >
          {currentPlayer.rv < 0 ? '-' : '+'}
          {Math.abs(currentPlayer.rv).toFixed()} SR
        </Text>
      </Flex>
      <Text fontSize={['12px', '14px']}>{formatDate(match.timestamp)}</Text>

      {/* Perfil das pretas */}
      <VStack gap="40px" py="20px" justify="space-between" h="full">
        <LinkBox
          display="flex"
          p="10px"
          rounded="10px"
          alignItems="center"
          gap="15px"
          bg="whiteAlpha.600"
        >
          {blackProfile && (
            <LinkOverlay as={Link} to={`/profile/${blackProfile._id}`} />
          )}
          <Avatar size="lg" src={blackProfile?.photoURL} />
          <Flex flexDir="column">
            <Flex alignItems="center" gap="5px">
              {blackProfile?.role === 'bot' && (
                <Badge rounded="5px" fontSize="12px" bg="blackAlpha.300">
                  Bot
                </Badge>
              )}
              <Text>{match.black.name}</Text>
            </Flex>
            <Flex gap="5px" alignItems="center">
              <Image
                ml="3px"
                src={getRankThumbnail(match.black.rating)}
                alt="rank"
                draggable={false}
              />
              {Math.round(match.black.rating)}{' '}
              <Text
                color={
                  match.black.rv > 0
                    ? 'green.400'
                    : match.black.rv === 0
                    ? 'gray.400'
                    : 'red.400'
                }
              >
                ({match.black.rv < 0 ? '-' : '+'}
                {Math.round(Math.abs(oponent.rv))})
              </Text>{' '}
              SR
            </Flex>
          </Flex>
        </LinkBox>
        <Flex
          gap={['8px 5px', '14px 8px']}
          flexWrap="wrap"
          justifyContent="center"
        >
          {match.moves.map((move, index) => (
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
          ))}
        </Flex>
        <Flex
          p="10px"
          rounded="10px"
          alignItems="center"
          gap="15px"
          bg="whiteAlpha.600"
          border="solid 5px white"
          boxSizing="border-box"
        >
          <Avatar size="lg" src={whiteProfile?.photoURL} />
          <Flex flexDir="column">
            <Flex alignItems="center" gap="5px">
              {whiteProfile?.role === 'bot' && (
                <Badge rounded="5px" fontSize="12px" bg="blackAlpha.300">
                  Bot
                </Badge>
              )}
              <Text>{currentPlayer.name}</Text>
            </Flex>
            <Flex gap="5px" alignItems="center">
              <Image
                ml="3px"
                src={getRankThumbnail(currentPlayer.rating)}
                alt="rank"
                draggable={false}
              />
              {Math.round(currentPlayer.rating)}{' '}
              <Text
                color={
                  currentPlayer.rv > 0
                    ? 'green.400'
                    : currentPlayer.rv === 0
                    ? 'gray.400'
                    : 'red.400'
                }
              >
                ({currentPlayer.rv < 0 ? '-' : '+'}
                {Math.round(Math.abs(currentPlayer.rv))})
              </Text>{' '}
              SR
            </Flex>
          </Flex>
        </Flex>
      </VStack>
    </Stack>
  )
}
