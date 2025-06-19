import { useGame } from '@/contexts/game.context.tsx'
import { useMemo } from 'react'

export function ResultModal() {
  const game = useGame()

  const score = useMemo(() => {
    if (game.currentTeam === null) return 0
    if (!game.finalReport) return 0

    const score = 2 * game.finalReport?.[game.currentTeam].score - 1 // Converts into a range from -1 to 1
    return Math.round(score * 100) / 100
  }, [game.currentTeam, game.finalReport])

  return (
    game.currentTeam !== null && (
      <div className="center flex-col gap-[10px] w-[500px] p-[20px] max-w-full cursor-pointer overflow-hidden">
        <h2 className="font-serif !text-6xl text-gold-4 !font-bold">
          {game.finalReport?.winner === 1 - game.currentTeam && 'DEFEAT'}
          {game.finalReport?.winner === null && 'DRAW'}
          {game.finalReport?.winner === game.currentTeam && 'VICTORY'}
        </h2>
        <div className="flex gap-[5px] text-gold-1 font-serif">
          <span className="font-bold">Match Score:</span>
          <span className="text-gold-4">{score}</span>
          <span className="font-bold ml-[10px]">LP Gain:</span>
          <span className="text-gold-4">
            {game.finalReport?.[game.currentTeam].lpGain || 0} LP
          </span>
        </div>
      </div>
    )
  )
}
