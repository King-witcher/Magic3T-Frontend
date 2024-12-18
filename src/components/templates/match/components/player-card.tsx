import { UserAvatar } from '@/components/molecules'
import { useAuth } from '@/contexts/auth.context.tsx'
import { useRatingInfo } from '@/hooks/use-rating-info'
import type { HistoryMatchPlayer } from '@/models/matches/Match'
import { userQueryOptions } from '@/utils/query-options'
import { tiersMap } from '@/utils/ranks'
import { getAcrylicProps } from '@/utils/style-helpers'
import {
  Badge,
  Flex,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'

interface Props {
  matchPlayer: HistoryMatchPlayer
  highlight?: 'blue' | 'red' | null
}

export function PlayerCard({ matchPlayer, highlight }: Props) {
  const { getRankInfo } = useRatingInfo()

  const rankInfo = useMemo(() => {
    return getRankInfo({
      // TODO: Fix it
      deviation: 0,
      rating: matchPlayer.score,
      timestamp: new Date(),
    })
  }, [matchPlayer.score])

  const tierInfo = tiersMap[rankInfo.tier]

  const userQuery = useQuery(userQueryOptions(matchPlayer.uid))

  const { user: authUser } = useAuth()

  return (
    <LinkBox
      display="flex"
      p="10px 14px"
      alignItems="center"
      w="300px"
      h="fit-content"
      overflow="hidden"
      gap="8px"
      transition="background 80ms linear"
      _hover={{
        bg: '#ffffff40',
      }}
      {...getAcrylicProps()}
    >
      <UserAvatar
        size={70}
        tier={rankInfo.tier}
        division={rankInfo.division}
        icon={userQuery.data?.summoner_icon || 0}
        m="20px 30px"
      />
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
            w="35px"
            src={tierInfo.emblem}
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
