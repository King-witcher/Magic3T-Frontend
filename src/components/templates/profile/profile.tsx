import { UserAvatar } from '@/components/molecules'
import { ChangeIconModal } from '@/components/organisms/modals/change-icon-modal'
import { useAuth } from '@/contexts/auth.context'
import { Api } from '@/services/api'
import { League, MatchDto, UserDto } from '@/services/nest-api'
import { leaguesMap } from '@/utils/ranks'
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
import { UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { MatchRow } from './match-row'

interface Props {
  user: UserDto
  matchesQuery: UseQueryResult<MatchDto[], Error>
  editable?: boolean
}

const divisionMap = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
}

export function ProfileTemplate({ user, matchesQuery, editable }: Props) {
  const changeIconModalDisclosure = useDisclosure()
  const { user: authenticatedUser } = useAuth()
  const { getToken } = useAuth()
  const leagueInfo = leaguesMap[user.rating.league]
  const client = useQueryClient()

  const progress = user.rating.points ?? (user.rating.progress || 0)

  async function saveIconChange(iconId: number) {
    await Api.patch(
      'users/me/icon',
      {
        iconId,
      },
      {
        headers: {
          Authorization: `${await getToken()}`,
        },
      }
    )
    await client.refetchQueries({
      queryKey: ['myself', authenticatedUser?.id],
    })

    console.log('refetched')
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
          icon={user.summonerIcon}
          league={user.rating.league}
          division={user.rating.division}
          size={140}
          m="180px 40px 30px 40px"
          onClick={editable ? changeIconModalDisclosure.onOpen : undefined}
          showPencil={editable}
          cursor={editable ? 'pointer' : 'auto'}
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
            {user.nickname}
          </Text>
        </Flex>
      </Stack>

      {/* Desktop ranks */}
      <Flex w="full" align="center" justify="space-evenly" hideBelow="sm">
        <Stack alignItems="center" userSelect="none" spacing={0}>
          <Image
            ml="3px"
            src={leagueInfo.emblem}
            alt="rank"
            draggable={false}
            w="250px"
          />
          <VStack spacing={0}>
            <Text fontSize="20px">Rating</Text>
            <Text fontSize="18px" fontWeight="700" textTransform="capitalize">
              {leagueInfo.name}{' '}
              {user.rating.division && divisionMap[user.rating.division]}
              {user.rating.league === League.Provisional
                ? ` - ${progress}%`
                : ` - ${user.rating.points} LP`}
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
            {progress < 100 && (
              <Box
                bg="#ffffff30"
                h="full"
                flex={100 - progress}
                overflow="hidden"
              />
            )}
          </Flex>
        </Stack>
        <Stack alignItems="center" userSelect="none" spacing={0}>
          <Image
            ml="3px"
            src={leaguesMap[League.Provisional].emblem}
            alt="rank"
            draggable={false}
            w="250px"
          />
          <VStack spacing={0}>
            <Text fontSize="20px">Experience</Text>
            <Text fontSize="18px" fontWeight="700" textTransform="capitalize">
              {leaguesMap[League.Provisional].name}
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
            <Box h="full" bg="#ffffffc0" flex={0} />
            <Box bg="#ffffff30" h="full" flex={1} overflow="hidden" />
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
              Stats
            </Text>
            <Text fontWeight={700}>
              {user.stats.wins} wins - {user.stats.draws} draws -{' '}
              {user.stats.defeats} defeats
            </Text>
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
              Rating
            </Text>
            <Text fontWeight={700}>
              {leagueInfo.name}{' '}
              {user.rating.division && divisionMap[user.rating.division]}
              {user.rating.league === League.Provisional
                ? ` - ${progress}%`
                : ` - ${user.rating.points} LP`}
            </Text>
            <Image
              w="70px"
              pos="absolute"
              right="0"
              top="50%"
              transform="translateY(-70%)"
              src={leagueInfo.emblem}
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
            <Text fontWeight={700}>{leaguesMap[League.Provisional].name}</Text>
            <Image
              w="70px"
              pos="absolute"
              right="0"
              top="50%"
              transform="translateY(-70%)"
              src={leaguesMap[League.Provisional].emblem}
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

      <Stack spacing="10px">
        {matchesQuery.data && matchesQuery.data.length >= 20 && (
          <Text fontSize="20px">Last 20 matches</Text>
        )}
        {matchesQuery.data && matchesQuery.data.length < 20 && (
          <Text fontSize="20px">{matchesQuery.data.length} recent matches</Text>
        )}
        {matchesQuery.isSuccess && (
          <Stack spacing="10px">
            {matchesQuery.data.map((match) => (
              <MatchRow key={match.id} match={match} viewAs={user.id} />
            ))}
          </Stack>
        )}
      </Stack>
    </Flex>
  )
}
