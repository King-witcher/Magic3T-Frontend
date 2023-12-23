import {
  VStack,
  Text,
  useToast,
  Center,
  Box,
  Stack,
  Flex,
  useBreakpoint,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { GameStatus } from '@/types/types'
import { useGame } from '@/contexts/GameContext'
import PlayerCard from './components/PlayerCard'
import { useAuth } from '@/contexts/AuthContext'
import SignInPage from '@/components/SignInPage'
import { Link } from 'react-router-dom'
import ChoiceTable from './components/ChoiceTable'
import { TimeCounter } from './components/TimeCounter'
import ChatBox from './components/ChatBox'

export default function GamePage() {
  const { user } = useAuth()
  const toast = useToast()
  const { disconnect, gameState, oponentTimer, playerTimer } = useGame()

  const playerTurn = gameState?.turn === 'player'
  const chatInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    switch (gameState?.gameStatus) {
      case GameStatus.Victory:
        toast({
          title: user?.nickname?.includes('burmor')
            ? 'Nha burmor toda fofinha vencedora c:'
            : 'Você venceu a partida!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        break

      case GameStatus.Defeat:
        toast({
          title: 'Você perdeu.',
          description: user?.nickname?.includes('burmor')
            ? 'Burbur, você merece vencer em tudo na vida :c eu te amo'
            : '',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
        break

      case GameStatus.Draw:
        toast({
          title: 'A partida acabou em empate.',
          description: user?.nickname?.includes('burmor')
            ? 'Burbur toda boa no Magic3T empatando com o Giu c:'
            : '',
          status: 'info',
          duration: 2000,
          isClosable: true,
        })
        break

      default:
        break
    }
  }, [gameState?.gameStatus])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  if (!user) return <SignInPage />
  if (!gameState) return null // Improve

  return (
    <Flex
      w="full"
      h="full"
      gap="20px"
      alignItems="stretch"
      justifyContent="center"
    >
      <VStack h="100%" justifyContent="space-between" w="500px">
        <PlayerCard player="opponent" chatInputRef={{ current: null }} />
        <Box pos="relative">
          <Stack>
            <TimeCounter
              fontSize="20px"
              timer={oponentTimer}
              textAlign="center"
            />
            <ChoiceTable />
            <TimeCounter
              fontSize="20px"
              timer={playerTimer}
              textAlign="center"
            />
          </Stack>
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
        <PlayerCard player="current" chatInputRef={chatInputRef} />
      </VStack>

      <ChatBox
        inputRef={chatInputRef}
        display={{
          base: 'none',
          lg: 'flex',
        }}
      />
    </Flex>
  )
}
