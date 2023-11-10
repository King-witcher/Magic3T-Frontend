import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { useAsync } from '@/hooks/useAsync'
import { models } from '@/models'
import {
  Avatar,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { enqueue, dequeue, queueModes } = useQueue()
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
          <Text>
            {userData.glicko.rating.toFixed()} (±
            {(2 * userData.glicko.deviation).toFixed()}) SR
          </Text>
        )}
      </Center>
      <Divider orientation="vertical" hideBelow={'sm'} />
      <VStack flex="1">
        <Heading fontFamily="nunito variable">PvP</Heading>
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
          <Flex
            alignItems="center"
            gap="10px"
            fontSize="20px"
            textAlign="center"
          >
            {queueModes.casual && <Spinner thickness="4px" speed="0.7s" />}
            Casual
          </Flex>
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
          <Flex
            alignItems="center"
            gap="10px"
            fontSize="20px"
            textAlign="center"
          >
            {queueModes.ranked && <Spinner thickness="4px" speed="0.7s" />}
            Ranqueada
          </Flex>
        </Flex>
      </VStack>
    </Center>
  )
}
