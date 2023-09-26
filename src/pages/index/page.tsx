import { useGame } from '@/contexts/GameContext'
import { GameMode, useQueue } from '@/contexts/QueueContext'
import { Flex, Grid, Heading, Spinner } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export default function Page() {
  const { connectGame } = useGame()
  const { enqueue, dequeue, queueMode } = useQueue()
  const navigate = useNavigate()

  function handleEnqueue() {
    enqueue(GameMode.Casual, handleFindMatch)
  }

  function handleFindMatch(payload: { matchId: string; playerKey: string }) {
    console.log(payload.matchId, payload.playerKey)
    connectGame(payload.matchId, payload.playerKey)
    navigate(`game/${payload.matchId}`) // Usar rediret em loader e actions
  }

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
      </Flex>
      {/* </Grid> */}
    </Flex>
  )
}
