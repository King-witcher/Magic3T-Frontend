import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useRankInfo } from '@/hooks/useRanks'
import { UserData } from '@/models/users/User'
import {
  Avatar,
  Center,
  Flex,
  Text,
  VStack,
  Image,
  Tooltip,
  Badge,
  Box,
  Divider,
} from '@chakra-ui/react'
import { useMemo } from 'react'

interface Props {
  user: UserData
}

export default function ProfileTab({ user }: Props) {
  const { getRankInfo } = useRankInfo()

  const matches = user.stats.wins + user.stats.draws + user.stats.defeats

  const rating = useMemo(() => (user ? getRankInfo(user.glicko) : null), [user])

  return (
    <Center h="100%">
      <VStack
        gap="5px"
        h="100%"
        w={{
          base: '100%',
          md: '400px',
        }}
        justifyContent="center"
      >
        <Avatar
          size="xl"
          src={user.photoURL || undefined}
          boxShadow="0 0 20px 10px #00000020"
        />
        <Flex alignItems="center" gap="8px">
          {user.role === 'bot' && (
            <Badge rounded="5px" fontSize="14px" bg="gray.200">
              Bot
            </Badge>
          )}
          <Text fontSize="30px">{user.nickname}</Text>
        </Flex>
        <Flex alignItems="center" userSelect="none" gap="4px">
          {user && (
            <Tooltip label="Rating">
              <Image
                ml="3px"
                src={rating?.thumbnail}
                alt="rank"
                draggable={false}
              />
            </Tooltip>
          )}
          <Text fontSize="18px" fontWeight="500" color="gray.500">
            {
              <>
                {rating?.rating}
                {rating?.precise && '!'}
                {!rating?.reliable && '?'} (±{rating?.deviation}) SR
              </>
            }
          </Text>
        </Flex>
        <Divider />
        <Text fontSize="18px">{matches} partidas jogadas</Text>
        {matches && (
          <>
            <Flex
              w="300px"
              h="20px"
              rounded="999px"
              overflow="hidden"
              gap="1px"
              color="white"
              fontSize="16px"
            >
              <Center
                bg="red.400"
                h="full"
                flex={user.stats.defeats / matches}
              />
              <Center
                bg="gray.400"
                h="full"
                flex={user.stats.draws / matches}
                overflow="hidden"
              />
              <Center
                bg="green.400"
                h="full"
                overflow="hidden"
                flex={user.stats.wins / matches}
              />
            </Flex>
            <Flex gap="10px">
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
          </>
        )}
      </VStack>
    </Center>
  )
}
