import { GameProvider } from '@/contexts/GameContext.tsx'
import { QueueProvider } from '@/contexts/QueueContext.tsx'
import { ReactNode } from 'react'

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
