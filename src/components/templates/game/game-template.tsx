import { ChoiceTable } from '@/components/organisms'
import { useGame } from '@/contexts/game.context.tsx'
import { useDialogStore } from '@/contexts/modal.store'
import { Team } from '@magic3t/types'
import { useEffect, useRef } from 'react'
import { ChatBox, ForfeitModal, PlayerCard, TimeCounter } from './components'
import { ResultModal } from './components/result-modal'
import * as ButtonGroup from '@/components/atoms/button-group'

export function GameTemplate() {
  const gameCtx = useGame()
  const showDialog = useDialogStore((state) => state.showDialog)
  const downTeam = gameCtx.currentTeam || Team.Order
  const upTeam = (1 - downTeam) as Team
  const downPlayer = gameCtx.teams[downTeam]
  const upPlayer = gameCtx.teams[upTeam]
  const chatInputRef = useRef<HTMLInputElement>(null)
  // parei aqui

  useEffect(() => {
    return gameCtx.onMatchReport((report) => {
      setTimeout(() => {
        showDialog(<ResultModal />, { closeOnOutsideClick: true })
      }, 500)
    })
  }, [])

  function showForfeitModal() {
    showDialog(<ForfeitModal onClose={() => {}} />, { closeOnOutsideClick: true })
  }

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
                showSurrender={!gameCtx.finished}
                onClickSurrender={showForfeitModal}
              />
            </div>
          </div>
          <ChatBox inputRef={chatInputRef} className="h-[400px] lg:h-[unset]" />
        </div>
        {gameCtx.finished && (
          <ButtonGroup.Root>
            <ButtonGroup.Button onClick={gameCtx.disconnect}>
              Leave Room
            </ButtonGroup.Button>
          </ButtonGroup.Root>
        )}
      </div>
    </div>
  )
}
