import { useGame } from '@/contexts/GameContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { useServiceStatus } from '@/contexts/ServiceStatusContext'
import { Center, Flex, Grid, Heading, Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export default function Page() {
  const { connectGame } = useGame()
  const { enqueue, dequeue, queueMode } = useQueue()
  const navigate = useNavigate()
  const { serverOnline } = useServiceStatus()

  function handleEnqueue() {
    enqueue(GameMode.Casual, handleFindMatch)
  }

  function handleFindMatch(payload: { matchId: string; playerKey: string }) {
    connectGame(payload.matchId, payload.playerKey)
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
          <Flex flexDir="column" alignItems="center" gap="10px">
            Partida rápida
            {queueMode && <Spinner />}
          </Flex>
        </Flex>
        {/* </Grid> */}
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
