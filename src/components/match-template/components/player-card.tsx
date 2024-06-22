import { useAuth } from '@/contexts/auth.context.tsx'
import { useRankInfo } from '@/hooks/useRanks'
import { HistoryMatchPlayer } from '@/models/matches/Match'
import { getUserQueryOptions } from '@/query-helpers'
import {
  Avatar,
  Badge,
  Flex,
  LinkBox,
  LinkOverlay,
  Text,
  Image,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

interface Props {
  matchPlayer: HistoryMatchPlayer
  highlight?: 'blue' | 'red' | null
}

export function PlayerCard({ matchPlayer, highlight }: Props) {
  const { getRankThumbnail } = useRankInfo()

  const userQuery = useQuery(getUserQueryOptions(matchPlayer.uid))

  const { user: authUser } = useAuth()

  return (
    <LinkBox
      display="flex"
      p="10px 14px"
      rounded="10px"
      alignItems="center"
      w="250px"
      overflow="hidden"
      gap="8px"
      bg="whiteAlpha.600"
      transition="background 80ms linear"
      _hover={{
        bg: 'white',
      }}
      border={
        highlight
          ? `solid 5px var(--chakra-colors-${highlight}-300)`
          : 'solid 5px var(--chakra-colors-gray-300)'
      }
      borderWidth="1px 1px 1px 6px"
    >
      <Avatar size="lg" src={userQuery.data?.photoURL} />
      <LinkOverlay
        as={Link}
        to={
          matchPlayer.uid === authUser?._id ? '/me' : `/user/${matchPlayer.uid}`
        }
      />
      <Flex flexDir="column">
        <Flex alignItems="center" gap="5px">
          {userQuery.data?.role === 'bot' && (
            <Badge rounded="5px" fontSize="12px" bg="blackAlpha.300">
              Bot
            </Badge>
          )}
          <Text>{matchPlayer.name}</Text>
        </Flex>
        <Flex gap="5px" alignItems="center">
          <Image
            ml="3px"
            src={getRankThumbnail(matchPlayer.score)}
            alt="rank"
            draggable={false}
          />
          {Math.round(matchPlayer.score)}{' '}
          <Text
            fontSize="14px"
            fontWeight={800}
            color={
              matchPlayer.gain > 0
                ? 'green.400'
                : matchPlayer.gain === 0
                  ? 'gray.400'
                  : 'red.400'
            }
          >
            {matchPlayer.gain < 0 ? '-' : '+'}
            {Math.round(Math.abs(matchPlayer.gain))}
          </Text>
        </Flex>
      </Flex>
    </LinkBox>
  )
}
