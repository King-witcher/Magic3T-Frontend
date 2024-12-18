import { useConfig } from '@/contexts/config.context.tsx'
import { Tier, useRankInfo } from '@/hooks/useRanks'
import type { UserData } from '@/models/users/user'
import { getIconUrl } from '@/utils/utils'
import { Avatar, Badge, Box, Flex, Image, Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import { UserAvatar } from '../user-avatar'

interface Props {
  user: UserData
}

const tierMap = {
  Unranked: 'Indefinido',
  Bronze: 'Bronze',
  Silver: 'Prata',
  Gold: 'Ouro',
  Diamond: 'Diamante',
  Elite: 'Elite',
}

const divisionMap = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
}

export function ProfileCard({ user }: Props) {
  const { getRankInfo } = useRankInfo()

  const matches = user.stats.wins + user.stats.draws + user.stats.defeats

  const { ratingConfig } = useConfig()

  const rinfo = useMemo(() => getRankInfo(user.glicko), [user])

  const progress = useMemo(() => {
    if (!rinfo.reliable) {
      return (350 - rinfo.deviation) / (350 - ratingConfig.maxReliableDeviation)
    }

    const bronze1 =
      ratingConfig.initialRating -
      ratingConfig.ranks.tierSize * ratingConfig.ranks.initialTier

    const currentTier =
      (user.glicko.rating - bronze1) / ratingConfig.ranks.tierSize

    const currentDivision = (currentTier * 5) % 1

    if (currentTier >= 4) return 1
    if (currentTier < 0) return 0

    return currentDivision
  }, [rinfo])

  return (
    <VStack
      gap="0px"
      w={{
        base: '100%',
        md: '400px',
      }}
      justifyContent="center"
    >
      <UserAvatar
        icon={user.summoner_icon}
        division={rinfo.division}
        size={150}
        wing={rinfo.wing}
        m="40px 0"
      />
      <Flex alignItems="center" gap="8px">
        {user.role === 'bot' && (
          <Badge rounded="5px" fontSize="14px" bg="gray.400">
            Bot
          </Badge>
        )}
        <Text
          fontSize="36px"
          lineHeight="39px"
          textAlign="center"
          fontWeight={500}
          rounded="10px"
          p="5px"
          _focusVisible={{
            outline: 'solid 1px var(--chakra-colors-gray-200)',
            fontWeight: 500,
          }}
        >
          {user.identification?.nickname}
        </Text>
      </Flex>
      <Flex alignItems="center" userSelect="none" gap="5px">
        <Image
          ml="3px"
          src={rinfo?.emblem}
          alt="rank"
          draggable={false}
          w="32px"
        />
        <Text fontSize="18px" fontWeight="700">
          {`${rinfo.tierName} ${
            rinfo.tier === Tier.Master || rinfo.tier === Tier.Provisional
              ? ''
              : divisionMap[rinfo.division]
          }`}{' '}
          - {rinfo.rating} ELO
        </Text>
        <Text fontSize="12px" fontWeight="500" color="#ffffffc0">
          ±{rinfo?.deviation}
        </Text>
      </Flex>
      <Flex
        mt="10px"
        w="400px"
        h="6px"
        rounded="999px"
        overflow="hidden"
        gap="1px"
        color="white"
        fontSize="16px"
      >
        {progress > 0 && <Box h="full" bg="#ffffffc0" flex={progress} />}
        {progress < 1 && (
          <Box bg="#ffffff30" h="full" flex={1 - progress} overflow="hidden" />
        )}
      </Flex>
      {matches && (
        <>
          <Flex
            mt="10px"
            w="300px"
            h="6px"
            rounded="999px"
            overflow="hidden"
            gap="1px"
            color="white"
            fontSize="16px"
          >
            {!!user.stats.defeats && (
              <Box bg="red.400" h="full" flex={user.stats.defeats / matches} />
            )}
            {!!user.stats.draws && (
              <Box
                bg="gray.400"
                h="full"
                flex={user.stats.draws / matches}
                overflow="hidden"
              />
            )}
            {!!user.stats.wins && (
              <Box
                bg="green.400"
                h="full"
                overflow="hidden"
                flex={user.stats.wins / matches}
              />
            )}
          </Flex>
          <Flex gap="10px" alignItems="center">
            <Text fontWeight="500" color="red.400">
              {Math.round((100 * user.stats.defeats) / matches)}%
            </Text>
            <Text fontWeight="500" color="gray.500">
              {Math.round((100 * user.stats.draws) / matches)}%
            </Text>
            <Text fontWeight="500" color="green.400">
              {Math.round((100 * user.stats.wins) / matches)}%
            </Text>
          </Flex>

          <Text fontSize="16px">{matches} partidas</Text>
        </>
      )}
    </VStack>
  )
}
