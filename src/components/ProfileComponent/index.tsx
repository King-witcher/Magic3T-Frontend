import { useConfig } from '@/contexts/ConfigContext'
import { useRankInfo } from '@/hooks/useRanks'
import { UserData } from '@/models/users/User'
import { Avatar, Badge, Flex, VStack, Text, Image, Box } from '@chakra-ui/react'
import { useMemo } from 'react'

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

export default function ProfileComponent({ user }: Props) {
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
      <Avatar
        src={user.photoURL || undefined}
        size={'xl'}
        rounded="20px"
        borderWidth="6px"
        borderColor={rinfo.colorScheme.darker}
        overflow="hidden"
        _before={{
          content: '""',
          inset: 0,
          pos: 'absolute',
        }}
        sx={{
          '--bg': rinfo ? 'colors.' + rinfo.colorScheme.lighter : 'white',
          '& img': {
            rounded: '14px',
            bg: 'linear-gradient(white, var(--bg))',
          },
        }}
      />
      <Flex alignItems="center" gap="8px">
        {user.role === 'bot' && (
          <Badge rounded="5px" fontSize="14px" bg="gray.200">
            Bot
          </Badge>
        )}
        <Text fontSize="30px">{user.nickname}</Text>
      </Flex>
      <Flex alignItems="center" userSelect="none" gap="5px">
        <Text
          color={rinfo.colorScheme.darker}
          fontSize="18px"
          fontWeight="700"
        >{`${tierMap[rinfo.tier]} ${
          rinfo.tier === 'Elite' || rinfo.tier === 'Unranked'
            ? ''
            : divisionMap[rinfo.division]
        }`}</Text>
        <Image
          ml="3px"
          src={rinfo?.thumbnail}
          alt="rank"
          draggable={false}
          w="32px"
        />
        <Text fontSize="16px" fontWeight="700" color="gray.600">
          {
            <>
              {rinfo?.rating}
              {rinfo?.precise && '!'}
              {!rinfo?.reliable && '?'}
            </>
          }
        </Text>
        <Text fontSize="12px" fontWeight="500" color="gray.600">
          ±{rinfo?.deviation}
        </Text>
      </Flex>
      <Flex
        mt="5px"
        w="300px"
        h="6px"
        rounded="999px"
        overflow="hidden"
        gap="1px"
        color="white"
        fontSize="16px"
      >
        {progress > 0 && (
          <Box bg={rinfo.colorScheme.darker} h="full" flex={progress} />
        )}
        {progress < 1 && (
          <Box bg="gray.300" h="full" flex={1 - progress} overflow="hidden" />
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
