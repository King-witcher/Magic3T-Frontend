import { useGame } from '@/contexts/game.context.tsx'
import { GameStatus } from '@/types/game.ts'
import { Box, Center, Flex, Text, VStack } from '@chakra-ui/react'
import { useRef } from 'react'
import { ChatBox, PlayerCard, TimeCounter } from './components'
import { ChoiceTable } from '@/components/organisms'

export function GameTemplate() {
  const {
    isActive,
    turn,
    disconnect,
    makeChoice,
    gameStatus,
    playerChoices,
    opponentChoices,
    opponentTimer,
    playerTimer,
  } = useGame()

  const playerTurn = turn === 'player'
  const chatInputRef = useRef<HTMLInputElement>(null)

  // useEffect(() => {
  //   return () => {
  //     if (
  //       gameStatus !== GameStatus.Playing &&
  //       gameStatus !== GameStatus.Waiting
  //     )
  //       disconnect()
  //   }
  // }, [gameStatus, disconnect])

  if (!isActive) return null // Improve

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
          <VStack gap="0">
            <TimeCounter
              w="120px"
              // border="solid 1px var(--chakra-colors-gray-200)"
              borderBottomWidth="0"
              rounded="10px 10px 0 0"
              color="black"
              textAlign="center"
              p="3px 0"
              fontSize="18px"
              timer={opponentTimer}
            />
            <ChoiceTable
              redMoves={opponentChoices}
              blueMoves={playerChoices}
              state={
                gameStatus === GameStatus.Playing
                  ? turn
                    ? 'selectable'
                    : 'static'
                  : 'disabled'
              }
              onSelect={makeChoice}
            />
            <TimeCounter
              w="120px"
              // border="solid 1px var(--chakra-colors-gray-200)"
              borderTopWidth="0"
              rounded="0 0 10px 10px"
              color="black"
              textAlign="center"
              p="3px 0"
              fontSize="18px"
              timer={playerTimer}
            />
          </VStack>
          <Text
            userSelect="none"
            opacity={
              playerTurn && gameStatus === GameStatus.Playing ? '1' : '0'
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
          {playerChoices.length === 0 &&
            opponentChoices.length === 0 &&
            gameStatus === GameStatus.Playing && (
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
                Aguarde a escolha do opponente.
              </Text>
            )}
          {gameStatus === GameStatus.Victory && (
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
          {gameStatus === GameStatus.Defeat && (
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
          {gameStatus === GameStatus.Draw && (
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
          {(gameStatus === GameStatus.Victory ||
            gameStatus === GameStatus.Defeat ||
            gameStatus === GameStatus.Draw) && (
            <Center
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
              onClick={disconnect}
            >
              <Text>Sair</Text>
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
