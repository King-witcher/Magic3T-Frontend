import { ButtonsContainer } from '@/components/atoms'
import { InnerButton } from '@/components/atoms/buttons-container/inner-button'
import { ChoiceTable } from '@/components/organisms'
import { useGame } from '@/contexts/game.context.tsx'
import { Team } from '@/types/game-socket'
import { GameStatus } from '@/types/game.ts'
import { useDisclosure } from '@chakra-ui/react'
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
    <div className="w-full">
      <div className="flex flex-col gap-[20px] lg:gap-[40px] w-full">
        <p className="text-center hidden xs:block text-grey-1">
          Be the first to select three numbers that add up to exactly 15.
        </p>
        <div className="flex flex-col h-min gap-[20px] items-stretch justify-center lg:flex-row w-full">
          <div className="lg:flex hidden flex-col gap-[20px] items-center justify-between">
            <PlayerCard team={upTeam} />
            <span>vs</span>
            <PlayerCard team={downTeam} />
          </div>
          <div className="flex flex-col gap-[20px] justify-center">
            <div className="flex flex-col gap-[20px] w-full items-center">
              <PlayerCard team={upTeam} w="full" hideFrom="sm" />
              <div className="acrylic center h-[50px] w-full">
                <TimeCounter
                  color="light"
                  fontSize="18px"
                  timer={upPlayer.timer}
                />
              </div>
              <ChoiceTable
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
              <div className="acrylic center h-[50px] w-full">
                <TimeCounter
                  color="light"
                  fontSize="18px"
                  timer={downPlayer.timer}
                />
              </div>
            </div>
          </div>
          <ChatBox inputRef={chatInputRef} h={{ base: '400px', sm: 'unset' }} />
        </div>
        <ButtonsContainer disabled={false}>
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
      </div>
      <ForfeitModal onClose={closeForfeitModal} isOpen={forfeitModaOpen} />
      <ResultModal
        onClose={resultModalDisclosure.onClose}
        isOpen={resultModalDisclosure.isOpen}
      />
    </div>
  )
}
