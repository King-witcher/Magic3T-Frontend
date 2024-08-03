import { useGame } from '@/contexts/game.context'
import { createFileRoute } from '@tanstack/react-router'
import { GamePage, Lobby } from '@/components/templates'

export const Route = createFileRoute('/_auth-guarded/')({
  component: () => {
    const { isActive } = useGame()

    return isActive ? <GamePage /> : <Lobby />
  },
})
