import { VStack, Text, useToast, Center, Box } from '@chakra-ui/react'
import { useEffect } from 'react'
import { GameStatus } from '@/types/types'
import { useGame } from '@/contexts/GameContext'
import PlayerCard from './components/PlayerCard'
import { useAuth } from '@/contexts/AuthContext'
import SignInPage from '@/components/SignInPage'
import { Link } from 'react-router-dom'
import ChoiceGrid from './components/Grid'

export default function GamePage() {
  const { user } = useAuth()
  const toast = useToast()
  const { disconnect, gameState } = useGame()

  const playerTurn = gameState?.turn === 'player'

  useEffect(() => {
    switch (gameState?.gameStatus) {
      case GameStatus.Victory:
        toast({
          title: user?.nickname?.includes('Bianca')
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
          description: user?.nickname?.includes('Bianca Vieira')
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
          description: user?.nickname?.includes('Bianca Vieira')
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
  }, [gameState?.gameStatus])

  useEffect(() => {
    if (gameState?.messages.length) {
      const { sender, content, timestamp } =
        gameState.messages[gameState.messages.length - 1]
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
  }, [gameState?.messages])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  if (!user) return <SignInPage />
  if (!gameState) return null // Improve

  return (
    <VStack h="100%" justifyContent="space-around">
      <PlayerCard player="opponent" />
      <Box pos="relative">
        <ChoiceGrid />
        <Text
          userSelect="none"
          opacity={
            playerTurn && gameState.gameStatus === GameStatus.Playing
              ? '1'
              : '0'
          }
          transition="opacity 200ms"
          fontWeight="semibold"
          color="green.500"
          pos="absolute"
          bottom="-20px"
          left="50%"
          transform="translate(-50%, 100%)"
        >
          Sua vez!
        </Text>
        {gameState.player.choices.length === 0 &&
          gameState.oponent.choices.length === 0 &&
          gameState.gameStatus === GameStatus.Playing && (
            <Text
              width="400px"
              textAlign="center"
              userSelect="none"
              opacity={playerTurn ? '0' : '1'}
              transition="opacity 200ms"
              fontWeight="semibold"
              color="gray.500"
              pos="absolute"
              bottom="-20px"
              left="50%"
              transform="translate(-50%, 100%)"
            >
              Aguarde a escolha do oponente.
            </Text>
          )}
        {gameState.gameStatus === GameStatus.Victory && (
          <Text
            width="400px"
            textAlign="center"
            userSelect="none"
            opacity={playerTurn ? '0' : '1'}
            transition="opacity 200ms"
            fontWeight="semibold"
            color="green.500"
            pos="absolute"
            bottom="-20px"
            left="50%"
            transform="translate(-50%, 100%)"
          >
            Você venceu!
          </Text>
        )}
        {gameState.gameStatus === GameStatus.Defeat && (
          <Text
            width="400px"
            textAlign="center"
            userSelect="none"
            opacity={playerTurn ? '0' : '1'}
            transition="opacity 200ms"
            fontWeight="semibold"
            color="red.600"
            pos="absolute"
            bottom="-20px"
            left="50%"
            transform="translate(-50%, 100%)"
          >
            Você perdeu.
          </Text>
        )}
        {gameState.gameStatus === GameStatus.Draw && (
          <Text
            width="400px"
            textAlign="center"
            userSelect="none"
            opacity={playerTurn ? '0' : '1'}
            transition="opacity 200ms"
            fontWeight="semibold"
            color="gray.600"
            pos="absolute"
            bottom="-20px"
            left="50%"
            transform="translate(-50%, 100%)"
          >
            Empate
          </Text>
        )}
        {(gameState.gameStatus === GameStatus.Victory ||
          gameState.gameStatus === GameStatus.Defeat ||
          gameState.gameStatus === GameStatus.Draw) && (
          <Center
            as={Link}
            to={`/profile/history/${gameState.matchId}`}
            w="200px"
            cursor="pointer"
            userSelect="none"
            transition="all 100ms linear"
            _hover={{
              bg: 'gray.100',
            }}
            bg="gray.200"
            p="10px"
            rounded="10px"
            pos="absolute"
            bottom="-55px"
            left="50%"
            transform="translate(-50%, 100%)"
          >
            <Text>Ver no histórico</Text>
          </Center>
        )}
      </Box>
      <PlayerCard player="current" />
    </VStack>
  )
}
