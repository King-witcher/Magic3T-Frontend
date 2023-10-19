import { Grid, VStack, Text, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'
import ChoiceComponent from './components/ChoiceComponent'
import { GameStatus } from '@/types/types'
import { useGame } from '@/contexts/GameContext'
import PlayerDeck from './components/PlayerDeck'
import { useAuth } from '@/contexts/AuthContext'
import SignInPage from '@/components/SignInPage'

export default function GamePage() {
  const { user } = useAuth()
  const toast = useToast()
  const {
    disconnect,
    makeChoice,
    availableChoices,
    playerChoices,
    oponentChoices,
    turn,
    gameStatus,
    messages,
  } = useGame()

  const playerTurn = turn === 'player'

  useEffect(() => {
    switch (gameStatus) {
      case GameStatus.Victory:
        toast({
          title: user?.displayName?.includes('Bianca Vieira')
            ? 'Nha burmor toda fofinha vencedora c:'
            : 'Você venceu a partida!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        break

      case GameStatus.Defeat:
        toast({
          title: 'Você perdeu.',
          description: user?.displayName?.includes('Bianca Vieira')
            ? 'Burbur, você merece vencer em tudo na vida :c eu te amo'
            : '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        break

      case GameStatus.Draw:
        toast({
          title: 'A partida acabou em empate.',
          description: user?.displayName?.includes('Bianca Vieira')
            ? 'Burbur toda boa no Magic3T empatando com o Giu c:'
            : '',
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
    if (messages.length) {
      const { sender, content, timestamp } = messages[messages.length - 1]
      toast({
        title: `${sender} diz:`,
        description: content,
        status: 'info',
        duration: 5000,
        isClosable: true,
        containerStyle: {
          maxW: '100%',
          p: '20px',
        },
      })
    }
  }, [messages])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  if (!user) return <SignInPage />

  return (
    <VStack h="100%" justifyContent="space-around">
      <PlayerDeck player="opponent" />
      <Grid
        width="fit-content"
        gridTemplateColumns="repeat(3, 1fr)"
        gap="10px"
        h="fit-content"
        pos="relative"
      >
        {availableChoices.map((choice) => (
          <ChoiceComponent
            choice={choice}
            key={choice}
            onClick={playerTurn ? () => makeChoice(choice) : undefined}
            cursor={playerTurn ? 'pointer' : 'auto'}
            opacity={gameStatus === GameStatus.Defeat ? '0' : '1'}
            transition="opacity 300ms linear"
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
          opacity={playerTurn && gameStatus === GameStatus.Playing ? '1' : '0'}
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
        {playerChoices.length === 0 &&
          oponentChoices.length === 0 &&
          gameStatus === GameStatus.Playing && (
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
        {gameStatus === GameStatus.Victory && (
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
            color="green.500"
          >
            Você venceu!
          </Text>
        )}
        {gameStatus === GameStatus.Defeat && (
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
            color="red.600"
          >
            Você perdeu.
          </Text>
        )}
        {gameStatus === GameStatus.Draw && (
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
            color="gray.600"
          >
            Empate
          </Text>
        )}
      </Grid>
      <PlayerDeck player="current" />
    </VStack>
  )
}
