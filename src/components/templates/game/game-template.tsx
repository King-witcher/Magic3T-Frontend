import { ButtonsContainer } from '@/components/atoms'
import { InnerButton } from '@/components/atoms/buttons-container/inner-button'
import { ChoiceTable } from '@/components/organisms'
import { useGame } from '@/contexts/game.context.tsx'
import { Team } from '@/types/game-socket'
import { GameStatus } from '@/types/game.ts'
import { getAcrylicProps } from '@/utils/style-helpers'
import {
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { ChatBox, ForfeitModal, PlayerCard, TimeCounter } from './components'
import { ResultModal } from './components/result-modal'

const statusText: Record<GameStatus, string> = {
  defeat: 'You lost',
  victory: 'You won',
  draw: 'Match draw',
  playing: 'Match in progress',
  waiting: '',
}

export function GameTemplate() {
  const gameCtx = useGame()
  const {
    isOpen: forfeitModaOpen,
    onClose: closeForfeitModal,
    onOpen: openForfeitModal,
  } = useDisclosure()
  const downTeam = gameCtx.currentTeam || Team.Order
  const upTeam = (1 - downTeam) as Team
  const downPlayer = gameCtx.teams[downTeam]
  const upPlayer = gameCtx.teams[upTeam]
  const chatInputRef = useRef<HTMLInputElement>(null)
  // parei aqui

  const resultModalDisclosure = useDisclosure()

  useEffect(() => {
    return gameCtx.onMatchReport((report) => {
      setTimeout(() => {
        resultModalDisclosure.onOpen()
      }, 500)
    })
  }, [])

  if (!gameCtx.isActive) return null // Improve
  return (
    <Center w="full">
      <VStack spacing={{ base: '20px', sm: '40px' }} w="full">
        <Heading w="fit-content" hideBelow="sm">
          {/* {statusText[gameStatus]} */}
        </Heading>
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
            <PlayerCard team={upTeam} />
            <Text color="light">vs</Text>
            <PlayerCard team={downTeam} />
          </Stack>
          <VStack gap="20px" justify="center">
            <VStack gap="20px" w="full">
              <PlayerCard team={upTeam} w="full" hideFrom="sm" />
              <Center {...getAcrylicProps()} h="50px" w="full">
                <TimeCounter
                  color="light"
                  fontSize="18px"
                  timer={upPlayer.timer}
                />
              </Center>
              <ChoiceTable
                w={{ base: 'full', sm: '300px' }}
                redMoves={upPlayer.choices}
                blueMoves={downPlayer.choices}
                state={
                  !gameCtx.finished
                    ? gameCtx.turn !== null &&
                      gameCtx.turn === gameCtx.currentTeam
                      ? 'selectable'
                      : 'static'
                    : 'disabled'
                }
                onSelect={gameCtx.pick}
              />
              <Center {...getAcrylicProps()} h="50px" w="full">
                <TimeCounter
                  color="light"
                  fontSize="18px"
                  timer={downPlayer.timer}
                />
              </Center>
            </VStack>
          </VStack>
          <ChatBox inputRef={chatInputRef} h={{ base: '400px', sm: 'unset' }} />
        </Flex>
        <ButtonsContainer w={{ base: 'full', sm: 'fit-content' }}>
          {!gameCtx.finished && (
            <InnerButton
              h="60px"
              w={{ base: 'full', sm: '200px' }}
              onClick={openForfeitModal}
            >
              Surrender
            </InnerButton>
          )}
          {gameCtx.finished && [
            <InnerButton
              key="leave"
              h="60px"
              w={{ base: 'full', sm: '200px' }}
              onClick={gameCtx.disconnect}
            >
              Leave room
            </InnerButton>,
            // <Link to={`/match/${matchId}`} key="view">
            //   <InnerButton h="60px" w={{ base: 'full', sm: '200px' }}>
            //     View match
            //   </InnerButton>
            // </Link>,
          ]}
        </ButtonsContainer>
      </VStack>
      <ForfeitModal onClose={closeForfeitModal} isOpen={forfeitModaOpen} />
      <ResultModal
        onClose={resultModalDisclosure.onClose}
        isOpen={resultModalDisclosure.isOpen}
      />
    </Center>
  )
}
