import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import { getEloUrl } from '@/utils/getEloUrl'
import {
  Avatar,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { enqueue, dequeue, queueModes, queueUserCount } = useQueue()
  const { serverOnline } = useServiceStatus()
  const { user } = useAuth()

  const [userData, loading] = useAsync(async () => {
    if (user) return models.users.getbyId(user.uid)
    return null
  }, [user])

  if (!user) return <SignInPage />

  if (serverOnline === undefined) {
    return (
      <Center w="100%" h="100%" fontSize="20px">
        Aguardando servidor principal
      </Center>
    )
  }

  if (serverOnline === false) {
    return (
      <Center w="100%" h="100%" fontSize="20px" color="red.500">
        Servidor principal offline
      </Center>
    )
  }

  return (
    <Center h="100%" gap="15px" flexDir={['column', 'row']}>
      <Center flex="1" flexDir="column">
        <Avatar src={user?.photoURL || undefined} size={'xl'} />
        <Text fontSize="22px">{user?.displayName}</Text>
        {userData && (
          <Flex alignItems="center" gap="5px">
            <Image
              ml="3px"
              src={getEloUrl(userData.glicko.rating)}
              alt="rank"
              draggable={false}
            />
            <Text>
              {userData.glicko.rating.toFixed()} (±
              {(2 * userData.glicko.deviation).toFixed()}) SR
            </Text>
          </Flex>
        )}
      </Center>
      <Divider orientation="vertical" hideBelow={'sm'} />
      <VStack flex="1">
        <Heading fontFamily="nunito variable">PvP</Heading>
        <Text fontSize="14px" fontWeight="700" color="green.500">
          {queueUserCount.connected <= 1
            ? 'Só você está online'
            : `${queueUserCount.connected} jogadores online`}
        </Text>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          transition="background 80ms linear"
          rounded="10px"
          cursor="pointer"
          fontSize="20px"
          userSelect="none"
          w="200px"
          fontWeight={700}
          h="80px"
          _hover={{
            bg: 'pink.200',
          }}
          onClick={
            queueModes.casual
              ? dequeue.bind(null, GameMode.Casual)
              : enqueue.bind(null, GameMode.Casual)
          }
        >
          <VStack gap="0">
            <Flex
              alignItems="center"
              gap="10px"
              fontSize="20px"
              textAlign="center"
            >
              {queueModes.casual && <Spinner thickness="4px" speed="0.7s" />}
              Casual
            </Flex>
            <Text
              fontSize="14px"
              color={queueUserCount.casual.queue ? 'green.400' : 'gray.400'}
            >
              {queueUserCount.casual.queue} jogador
              {queueUserCount.casual.queue !== 1 ? 'es' : ''}
            </Text>
          </VStack>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          transition="background 80ms linear"
          rounded="10px"
          fontSize="20px"
          cursor="pointer"
          userSelect="none"
          w="200px"
          fontWeight={700}
          h="80px"
          _hover={{
            bg: 'pink.200',
          }}
          onClick={
            queueModes.ranked
              ? dequeue.bind(null, GameMode.Ranked)
              : enqueue.bind(null, GameMode.Ranked)
          }
        >
          <VStack gap="0">
            <Flex
              alignItems="center"
              gap="10px"
              fontSize="20px"
              textAlign="center"
            >
              {queueModes.ranked && <Spinner thickness="4px" speed="0.7s" />}
              Ranqueada
            </Flex>
            <Text
              fontSize="14px"
              color={queueUserCount.ranked.queue ? 'green.400' : 'gray.400'}
            >
              {queueUserCount.ranked.queue} jogador
              {queueUserCount.ranked.queue !== 1 ? 'es' : ''}
            </Text>
          </VStack>
        </Flex>
      </VStack>
    </Center>
  )
}
