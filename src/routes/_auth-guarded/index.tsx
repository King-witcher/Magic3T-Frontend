import { GameTemplate, LobbyTemplate } from '@/components/templates'
import { useGame } from '@/contexts/game.context'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth-guarded/')({
  component: () => {
    const { isActive } = useGame()

    return isActive ? <GameTemplate /> : <LobbyTemplate />
  },
})
