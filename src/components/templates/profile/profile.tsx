import { UserAvatar } from '@/components/molecules'
import { ChangeIconModal } from '@/components/organisms/modals/change-icon-modal'
import { useAuth } from '@/contexts/auth.context'
import { useConfig } from '@/contexts/config.context.tsx'
import { Tier, useRatingInfo } from '@/hooks/use-rating-info'
import type { UserData } from '@/models/users/user'
import { Api } from '@/services/api'
import { tiersMap } from '@/utils/ranks'
import {
  Badge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useMemo } from 'react'

interface Props {
  user: UserData
}

const divisionMap = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
}

export function ProfileTemplate({ user }: Props) {
  const { getRankInfo } = useRatingInfo()
  const changeIconModalDisclosure = useDisclosure()
  const { user: authenticatedUser } = useAuth()

  const { getToken } = useAuth()

  const { ratingConfig } = useConfig()

  const rinfo = getRankInfo(user.glicko)
  const tierInfo = tiersMap[rinfo.tier]

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

  async function saveIconChange(iconId: number) {
    await Api.patch(
      'user/me/icon',
      {
        iconId,
      },
      {
        headers: {
          Authorization: `${await getToken()}`,
        },
      }
    )
  }

  return (
    <Flex
      align="cneter"
      justify="center"
      w="full"
      justifyContent="center"
      gap="40px"
      pb="40px"
      flexDir="column"
    >
      <Stack spacing={0} alignSelf="center" align="center">
        <UserAvatar
          icon={user.summoner_icon}
          tier={rinfo.tier}
          division={rinfo.division}
          size={140}
          m="180px 40px 30px 40px"
          onClick={
            user._id === authenticatedUser?._id
              ? changeIconModalDisclosure.onOpen
              : undefined
          }
          cursor={user._id === authenticatedUser?._id ? 'pointer' : 'auto'}
        />
        <Flex alignItems="center" gap="8px">
          {(user.role === 'bot' || user.role === 'creator') && (
            <Badge rounded="5px" fontSize="14px" bg="#ffffff40" color="light">
              {user.role}
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
      </Stack>

      {/* Desktop ranks */}
      <Flex w="full" align="center" justify="space-evenly" hideBelow="sm">
        <Stack alignItems="center" userSelect="none" spacing={0}>
          <Image
            ml="3px"
            src={tierInfo.emblem}
            alt="rank"
            draggable={false}
            w="250px"
          />
          <VStack spacing={0}>
            <Text fontSize="20px">Ranking</Text>
            <Text fontSize="18px" fontWeight="700" textTransform="capitalize">
              {tierInfo.name} {rinfo.division && divisionMap[rinfo.division]}
              {rinfo.reliable && ` - ${rinfo.rating} ELO`}
            </Text>
            <Text fontSize="12px" fontWeight="500" color="#ffffffc0">
              {user.stats.wins} wins - {user.stats.draws} draws -{' '}
              {user.stats.defeats} defeats
            </Text>
          </VStack>

          <Flex
            mt="10px"
            w={{ base: 'full', sm: '250px' }}
            h="8px"
            rounded="999px"
            overflow="hidden"
            gap="1px"
            color="white"
            fontSize="16px"
          >
            {progress > 0 && <Box h="full" bg="#ffffffc0" flex={progress} />}
            {progress < 1 && (
              <Box
                bg="#ffffff30"
                h="full"
                flex={1 - progress}
                overflow="hidden"
              />
            )}
          </Flex>
        </Stack>
        <Stack alignItems="center" userSelect="none" spacing={0}>
          <Image
            ml="3px"
            src={tiersMap[Tier.Provisional].emblem}
            alt="rank"
            draggable={false}
            w="250px"
          />
          <VStack spacing={0}>
            <Text fontSize="20px">Experience</Text>
            <Text fontSize="18px" fontWeight="700" textTransform="capitalize">
              {tiersMap[Tier.Provisional].name}
            </Text>
            <Text fontSize="12px" fontWeight="500" color="#ffffffc0">
              0 xp
            </Text>
          </VStack>

          <Flex
            mt="10px"
            w={{ base: 'full', sm: '250px' }}
            h="8px"
            rounded="999px"
            overflow="hidden"
            gap="1px"
            color="white"
            fontSize="16px"
          >
            {progress > 0 && <Box h="full" bg="#ffffffc0" flex={0} />}
            {progress < 1 && (
              <Box bg="#ffffff30" h="full" flex={1} overflow="hidden" />
            )}
          </Flex>
        </Stack>
      </Flex>

      {/* Mobile ranks */}
      <Stack hideFrom="sm" spacing="10px">
        <Stack spacing={0}>
          <Flex
            w="full"
            align="center"
            justify="space-between"
            pos="relative"
            h="70px"
          >
            <Text fontSize="12px" pos="absolute" top="0" left="0">
              Ranking
            </Text>
            <Text fontWeight={700}>
              {tierInfo.name} {rinfo.division && divisionMap[rinfo.division]}
              {rinfo.reliable && ` - ${rinfo.rating} ELO`}
            </Text>
            <Image
              w="70px"
              pos="absolute"
              right="0"
              top="50%"
              transform="translateY(-70%)"
              src={tierInfo.emblem}
            />
          </Flex>
        </Stack>

        <Stack spacing={0}>
          <Flex
            w="full"
            align="center"
            justify="space-between"
            pos="relative"
            h="70px"
          >
            <Text fontSize="12px" pos="absolute" top="0" left="0">
              Experience
            </Text>
            <Text fontWeight={700}>{tiersMap[Tier.Provisional].name}</Text>
            <Image
              w="70px"
              pos="absolute"
              right="0"
              top="50%"
              transform="translateY(-70%)"
              src={tiersMap[Tier.Provisional].emblem}
            />
          </Flex>
        </Stack>
      </Stack>

      <ChangeIconModal
        user={user}
        onSave={saveIconChange}
        isOpen={changeIconModalDisclosure.isOpen}
        onClose={changeIconModalDisclosure.onClose}
      />

      {/* <Text fontSize="20px">Last 20 games</Text> */}
    </Flex>
  )
}
