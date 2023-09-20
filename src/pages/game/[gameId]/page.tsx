import { useGameConnector } from '@/hooks/useGameConnector'
import { Box, Flex, Grid, VStack, Text, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ChoiceComponent from '../components/ChoiceComponent'
import ChoiceCollection from '../components/ChoiceCollection'
import { TimeCounter } from '../components/TimeCounter'
import { GameStatus } from '@/types/types'

export default function GamePage() {
  const { gameId } = useParams()
  const toast = useToast()
  const {
    connectGame,
    makeChoice,
    availableChoices,
    playerChoices,
    playerTimer,
    oponentChoices,
    oponentTimer,
    turn,
    gameStatus,
  } = useGameConnector()

  const playerTurn = turn === 'player'

  useEffect(() => {
    switch (gameStatus) {
      case GameStatus.Victory:
        toast({
          title: 'Você venceu a partida!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        break

      case GameStatus.Defeat:
        toast({
          title: 'Você perdeu.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        break

      case GameStatus.Draw:
        toast({
          title: 'A partida acabou em empate.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        })
        break

      default:
        break
    }
  }, [gameStatus])

  useEffect(() => {
    if (gameId) connectGame(gameId)
  }, [])

  return (
    <VStack h="100%" justifyContent="space-around">
      <Flex flex="1" w="100%" justifyContent="flex-end">
        <Flex alignItems="center" h="fit-content" gap="30px" margin="10px">
          <ChoiceCollection choices={oponentChoices} flexDir="row-reverse" />
          <VStack>
            <Flex
              rounded="100%"
              bg="red.500"
              w="70px"
              h="70px"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              color="white"
            >
              <TimeCounter timer={oponentTimer} />
            </Flex>
            <Text fontWeight="bold">Anônimo</Text>
          </VStack>
        </Flex>
      </Flex>
      <Grid
        width="fit-content"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="10px"
        h="fit-content"
        pos="relative"
        opacity={gameStatus === GameStatus.Defeat ? '0' : '1'}
        transition="opacity 300ms linear"
      >
        {availableChoices.map((choice) => (
          <ChoiceComponent
            choice={choice}
            onClick={playerTurn ? () => makeChoice(choice) : undefined}
            cursor={playerTurn ? 'pointer' : 'auto'}
            _hover={
              playerTurn
                ? {
                    bg: 'pink.200',
                  }
                : undefined
            }
          />
        ))}
        <Text
          userSelect="none"
          opacity={playerTurn ? '1' : '0'}
          transition="opacity 200ms"
          pos="absolute"
          bottom="-10px"
          left="50%"
          transform="translate(-50%, 100%)"
          fontWeight="semibold"
          color="green.500"
        >
          Sua vez!
        </Text>
        {playerChoices.length === 0 && oponentChoices.length === 0 && (
          <Text
            width="400px"
            textAlign="center"
            userSelect="none"
            opacity={playerTurn ? '0' : '1'}
            transition="opacity 200ms"
            pos="absolute"
            bottom="-10px"
            left="50%"
            transform="translate(-50%, 100%)"
            fontWeight="semibold"
            color="gray.500"
          >
            Aguarde a vez do oponente.
          </Text>
        )}
      </Grid>
      <Flex flex="1" w="100%" justifyContent="flex-start" alignItems="flex-end">
        <Flex alignItems="center" h="fit-content" gap="30px" margin="10px">
          <VStack>
            <Flex
              rounded="100%"
              bg="green.500"
              w="70px"
              h="70px"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              color="white"
            >
              <TimeCounter timer={playerTimer} />
            </Flex>
            <Text fontWeight="bold">Você</Text>
          </VStack>
          <ChoiceCollection choices={playerChoices} />
        </Flex>
      </Flex>
    </VStack>
  )
}
