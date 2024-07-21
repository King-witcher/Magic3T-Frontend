import { GameProvider } from '@/contexts/game.context.tsx'
import { QueueProvider } from '@/contexts/queue.context.tsx'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function GuardedProviders({ children }: Props) {
  return (
    <GameProvider>
      <QueueProvider>{children}</QueueProvider>
    </GameProvider>
  )
}
