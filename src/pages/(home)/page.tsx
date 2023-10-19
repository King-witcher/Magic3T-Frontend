import SignInPage from '@/components/SignInPage'
import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import {
  Center,
  Flex,
  Heading,
  Spinner,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { connectGame } = useGame()
  const { enqueue, dequeue, queueMode } = useQueue()
  const navigate = useNavigate()
  const { serverOnline } = useServiceStatus()
  const { user, isLoading } = useAuth()

  const handleEnqueue = useCallback(() => {
    enqueue(GameMode.Casual, handleFindMatch)
  }, [enqueue])

  async function handleFindMatch(payload: { matchId: string }) {
    await connectGame(payload.matchId)
    navigate(`/game/${payload.matchId}`) // Usar rediret em loader e actions
  }

  useEffect(() => {}, [])

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
    <VStack h="100%" gap="15px" justifyContent="center">
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
        onClick={queueMode ? dequeue : handleEnqueue}
      >
        <Flex alignItems="center" gap="10px" fontSize="20px" textAlign="center">
          {queueMode && <Spinner thickness="4px" speed="0.7s" />}Casual
        </Flex>
      </Flex>
      <Tooltip label="Aguarde!">
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          transition="background 80ms linear"
          rounded="10px"
          cursor="not-allowed"
          fontSize="20px"
          userSelect="none"
          w="200px"
          fontWeight={700}
          h="80px"
          opacity="0.5"
          // _hover={{
          //   bg: 'pink.200',
          // }}
        >
          <Flex
            alignItems="center"
            gap="10px"
            fontSize="20px"
            textAlign="center"
          >
            Ranqueada
          </Flex>
        </Flex>
      </Tooltip>
    </VStack>
  )
}
