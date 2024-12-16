import { useGame } from '@/contexts/game.context.tsx'
import { GameStatus } from '@/types/game.ts'
import {
  Box,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { ChatBox, ForfeitModal, PlayerCard, TimeCounter } from './components'
import { ChoiceTable } from '@/components/organisms'
import { ButtonsContainer } from '@/components/atoms'
import { InnerButton } from '@/components/atoms/buttons-container/inner-button'
import { Link } from '@tanstack/react-router'

const statusText: Record<GameStatus, string> = {
  defeat: 'You lost',
  victory: 'You won',
  draw: 'Match draw',
  playing: 'Match in progress',
  waiting: '',
}

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
    matchId,
  } = useGame()
  const {
    isOpen: forfeitModaOpen,
    onClose: closeForfeitModal,
    onOpen: openForfeitModal,
  } = useDisclosure()
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
    <Center w="full">
      <VStack spacing={{ base: '20px', sm: '40px' }} w="full">
        <Heading w="fit-content">{statusText[gameStatus]}</Heading>
        <Flex
          h="min-content"
          gap="20px"
          align="stretch"
          justify="center"
          flexDir={{ base: 'column', sm: 'row' }}
          w="full"
        >
          <Stack
            spacing="20px"
            align="center"
            justify="space-between"
            hideBelow="sm"
          >
            <PlayerCard player="opponent" />
            <Text color="light">vs</Text>
            <PlayerCard player="current" />
          </Stack>
          <VStack gap="20px" justify="center">
            <VStack gap="20px" w="full">
              <PlayerCard player="opponent" w="full" hideFrom={'sm'} />
              <Center
                rounded="10px"
                h="50px"
                bg="#ffffff30"
                border="1px solid #ffffff40"
                boxShadow="0 0 10px 0 #00000040"
                w="full"
              >
                <TimeCounter
                  color="light"
                  fontSize="18px"
                  timer={opponentTimer}
                />
              </Center>
              <ChoiceTable
                w={{ base: 'full', sm: '300px' }}
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
              <Center
                rounded="10px"
                h="50px"
                bg="#ffffff30"
                border="1px solid #ffffff40"
                boxShadow="0 0 10px 0 #00000040"
                w="full"
              >
                <TimeCounter
                  color="light"
                  fontSize="18px"
                  timer={playerTimer}
                />
              </Center>
              <PlayerCard player="current" w="full" hideFrom={'sm'} />
            </VStack>
          </VStack>
          <ChatBox inputRef={chatInputRef} h={{ base: '400px', sm: 'unset' }} />
        </Flex>
        <ButtonsContainer w={{ base: 'full', sm: 'fit-content' }}>
          {gameStatus === GameStatus.Playing && (
            <InnerButton
              h="60px"
              w={{ base: 'full', sm: '200px' }}
              onClick={openForfeitModal}
            >
              Surrender
            </InnerButton>
          )}
          {(gameStatus === GameStatus.Victory ||
            gameStatus === GameStatus.Defeat ||
            gameStatus === GameStatus.Draw) && (
            <>
              <InnerButton
                h="60px"
                w={{ base: 'full', sm: '200px' }}
                onClick={disconnect}
              >
                Leave room
              </InnerButton>
              <Link to={`/match/${matchId}`}>
                <InnerButton h="60px" w={{ base: 'full', sm: '200px' }}>
                  View match
                </InnerButton>
              </Link>
            </>
          )}
        </ButtonsContainer>
      </VStack>
      <ForfeitModal onClose={closeForfeitModal} isOpen={forfeitModaOpen} />
    </Center>
  )
}
