import { useAuth } from '@/contexts/auth.context.tsx'
import { useRankInfo } from '@/hooks/useRanks'
import type { HistoryMatchPlayer } from '@/models/matches/Match'
import { userQueryOptions } from '@/utils/query-options'
import { getAcrylicProps } from '@/utils/style-helpers'
import {
  Avatar,
  Badge,
  Flex,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

interface Props {
  matchPlayer: HistoryMatchPlayer
  highlight?: 'blue' | 'red' | null
}

export function PlayerCard({ matchPlayer, highlight }: Props) {
  const { getRankThumbnail } = useRankInfo()

  const userQuery = useQuery(userQueryOptions(matchPlayer.uid))

  const { user: authUser } = useAuth()

  return (
    <LinkBox
      display="flex"
      p="10px 14px"
      alignItems="center"
      w="250px"
      h="fit-content"
      overflow="hidden"
      gap="8px"
      transition="background 80ms linear"
      _hover={{
        bg: '#ffffff40',
      }}
      {...getAcrylicProps()}
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
