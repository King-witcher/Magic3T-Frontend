import { ButtonsContainer, TimerValue } from '@/components/atoms'
import { InnerButton } from '@/components/atoms/buttons-container/inner-button'
import { ChoiceTable } from '@/components/organisms'
import { useGame } from '@/contexts/game.context.tsx'
import { Team } from '@/types/game-socket'
import { GameStatus } from '@/types/game.ts'
import { useDisclosure } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { ChatBox, ForfeitModal, PlayerCard, TimeCounter } from './components'
import { ResultModal } from './components/result-modal'
import { useModalStore } from '@/contexts/modal.store'

const statusText: Record<GameStatus, string> = {
  defeat: 'You lost',
  victory: 'You won',
  draw: 'Match draw',
  playing: 'Match in progress',
  waiting: '',
}

export function GameTemplate() {
  const gameCtx = useGame()
  const openModal = useModalStore((state) => state.openModal)
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

  useEffect(() => {
    return gameCtx.onMatchReport((report) => {
      setTimeout(() => {
        openModal(<ResultModal />, { closeOnOutsideClick: true })
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
              <PlayerCard team={upTeam} className="w-full lg:hidden" />
              <TimeCounter
                timer={upPlayer.timer}
                pause={gameCtx.turn === null}
              />
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
              <TimeCounter
                timer={downPlayer.timer}
                pause={gameCtx.turn === null}
              />
            </div>
          </div>
          <ChatBox inputRef={chatInputRef} className="h-[400px] lg:h-[unset]" />
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
    </div>
  )
}
