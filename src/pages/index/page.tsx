import { useAuth } from '@/contexts/AuthContext'
import { useGame } from '@/contexts/GameContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { Center, Flex, Grid, Heading, Spinner } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Page() {
  const { connectGame } = useGame()
  const { enqueue, dequeue, queueMode } = useQueue()
  const navigate = useNavigate()
  const { serverOnline } = useServiceStatus()
  const { user } = useAuth()

  const handleEnqueue = useCallback(() => {
    enqueue(GameMode.Casual, handleFindMatch)
  }, [enqueue])

  async function handleFindMatch(payload: { matchId: string }) {
    await connectGame(payload.matchId)
    navigate(`game/${payload.matchId}`) // Usar rediret em loader e actions
  }

  if (serverOnline)
    return (
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        gap="20px"
        alignItems="center"
        justifyContent="center"
      >
        <Heading>Jogar</Heading>
        {/* <Grid
        gridTemplateColumns={'200px 200px'}
        gridTemplateRows="200px 200px"
        gap="10px"
      > */}
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="gray.100"
          rounded="10px"
          cursor="pointer"
          fontSize="20px"
          userSelect="none"
          w="200px"
          h="200px"
          _hover={{
            bg: 'pink.200',
          }}
          onClick={queueMode ? dequeue : handleEnqueue}
        >
          <Flex
            flexDir="column"
            alignItems="center"
            gap="10px"
            fontSize="20px"
            textAlign="center"
          >
            {!queueMode && 'Partida rápida'}
            {queueMode && (
              <>
                Procurando outro jogador... <Spinner />
              </>
            )}
          </Flex>
          {/* </Grid> */}
        </Flex>
      </Flex>
    )
  else if (serverOnline === undefined)
    return (
      <Center w="100%" h="100%" fontSize="20px">
        Aguardando servidor principal
      </Center>
    )
  else
    return (
      <Center w="100%" h="100%" fontSize="20px" color="red.500">
        Servidor principal offline
      </Center>
    )
}
