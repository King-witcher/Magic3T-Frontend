import { useAuth } from '@/contexts/AuthContext'
import { useRankInfo } from '@/hooks/useRanks'
import { MatchPlayer } from '@/models/matches/Match'
import { UserData } from '@/models/users/User'
import {
  Avatar,
  Badge,
  Flex,
  LinkBox,
  LinkOverlay,
  Text,
  Image,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface Props {
  user?: UserData | null
  matchPlayer: MatchPlayer
  highlight?: boolean
}

export default function PlayerCard({ user, matchPlayer, highlight }: Props) {
  const { getRankThumbnail } = useRankInfo()

  const { user: authUser } = useAuth()

  return (
    <LinkBox
      display="flex"
      p="10px"
      rounded="10px"
      alignItems="center"
      gap="15px"
      bg="white"
      border={
        highlight
          ? 'solid 5px var(--chakra-colors-blue-300)'
          : 'solid 5px var(--chakra-colors-gray-300)'
      }
    >
      <LinkOverlay
        as={Link}
        to={
          matchPlayer.uid === authUser?._id ? '/me' : `/user/${matchPlayer.uid}`
        }
      />
      <Avatar size="lg" src={user?.photoURL} />
      <Flex flexDir="column">
        <Flex alignItems="center" gap="5px">
          {user?.role === 'bot' && (
            <Badge rounded="5px" fontSize="12px" bg="blackAlpha.300">
              Bot
            </Badge>
          )}
          <Text>{matchPlayer.name}</Text>
        </Flex>
        <Flex gap="5px" alignItems="center">
          <Image
            ml="3px"
            src={getRankThumbnail(matchPlayer.rating)}
            alt="rank"
            draggable={false}
          />
          {Math.round(matchPlayer.rating)}{' '}
          <Text
            color={
              matchPlayer.rv > 0
                ? 'green.400'
                : matchPlayer.rv === 0
                ? 'gray.400'
                : 'red.400'
            }
          >
            ({matchPlayer.rv < 0 ? '-' : '+'}
            {Math.round(Math.abs(matchPlayer.rv))})
          </Text>{' '}
          SR
        </Flex>
      </Flex>
    </LinkBox>
  )
}
